from flask import Blueprint, request, jsonify, make_response, current_app, send_from_directory, abort
from datetime import datetime, timedelta
from datetime import datetime
import pytz

from app.models.db import get_db_connection
from app.decorators.auth import token_required
from app.functions.user_role import user_role

import jwt
import json

user_views = Blueprint('user', __name__)
mexico_central= pytz.timezone("America/Mexico_City")

@user_views.route('/api/get_all_users')
@token_required
def get_all_users(user_data):

    conn = get_db_connection()
    cur = conn.cursor()
    #Obtenemos el role del usuario que hace la petició
    role = user_role(cur=cur, id_user=user_data['id'])
    #Si el role es diferente de "admin" regresa un error de autorización
    if role != 'admin':
        cur.close()
        conn.close()
        abort(403)

    # Obtener parámetros de paginación
    page = int(request.args.get('page', 1))  # Página actual (default 1)
    per_page = int(request.args.get('per_page', 5))  # Elementos por página (default 5)
    search = request.args.get('search','') # Elemento a buscar (Si existe)
    offset = (page - 1) * per_page

    if search == 'none':
        # Contar total de usuarios (para frontend)
        cur.execute("SELECT COUNT(*) FROM public.users_show_all_info WHERE user_role != %s", ('admin',))
        total_users = cur.fetchone()[0]

        # Consulta paginada
        cur.execute('''
            SELECT * FROM public.users_show_all_info
            WHERE user_role != %s
            ORDER BY user_name
            LIMIT %s OFFSET %s
        ''', ('admin', per_page, offset))
        #Ordenamos los datos de todos los usuarios en un objeto
        rows = cur.fetchall()
        users = [{'user_id': r[0], 'user_name': r[1], 'user_last_name': r[2], 'user_email': r[3], 
                  'user_role': r[4], 'user_phone': r[5], 'assig_psycho': r[7],
                  'user_age' : r[6].strftime('%Y-%m-%d') if r[6] else None, 'appoint_type': r[8]} for r in rows]

        return jsonify({
            'users': users,
            'total': total_users,
            'page': page,
            'per_page': per_page
        })
    
    else:
        #Consulta de total de paginas en la busqueda
        cur.execute(''' SELECT COUNT(*)
    FROM public.users_show_all_info
    WHERE user_role != %s
    AND (
        user_name ILIKE %s
        OR user_last_name ILIKE %s
        OR (user_name || ' ' || user_last_name) ILIKE %s
        OR user_email ILIKE %s
    )''', 
                    ('admin', f'{search}%', f'%{search}%', f'{search}%', f'{search}%'))
        total_users = cur.fetchone()[0]

        #Consulta de usuarios
        cur.execute(
        '''SELECT * FROM public.users_show_all_info
        WHERE user_role != %s AND (
        user_name ILIKE %s
        OR user_last_name ILIKE %s
        OR (user_name || ' ' || user_last_name) ILIKE %s
        OR user_email ILIKE %s)
        ORDER BY user_name LIMIT %s OFFSET %s''',
        ('admin', f'{search}%', f'%{search}%', f'{search}%', f'{search}%', per_page, offset))
        #Ordenamos los datos de todos los usuarios en un objeto
        rows = cur.fetchall()
        users = [{'user_id': r[0], 'user_name': r[1], 'user_last_name': r[2], 'user_email': r[3], 
                  'user_role': r[4], 'user_phone': r[5], 'assig_psycho': r[7],
                  'user_age' : r[6].strftime('%Y-%m-%d') if r[6] else None, 'appoint_type': r[8]} for r in rows]
        return jsonify({
            'users': users,
            'total' : total_users,
            'page' : page,
            'per_page' : per_page
        })


@user_views.route('/api/edit_user', methods = ['PUT'])
@token_required
def edit_user(user_data):
    conn = get_db_connection()
    cur = conn.cursor()

    role = user_role(id_user=user_data['id'], cur=cur)

    if role != 'admin':
        cur.close()
        conn.close()
        abort(403)

    raw_user = request.form.get('user')
    user = json.loads(raw_user)

    if not user['user_name'] or not user['user_last_name'] or not user['user_phone']:
        return jsonify({'message' : 'Error: faltan credenciales', 'type' : 'error'})

    cur.execute('UPDATE public.users '
	'SET user_name=%s, user_last_name=%s, user_email=%s, user_role=%s, user_phone=%s'
	'WHERE id_user=%s;', (user['user_name'], user['user_last_name'], user['user_email'], user['user_role'],  user['user_phone'], user['user_id']))

    if user['user_role'] == 'patient':

        if user['assig_psycho'] in ('', 'null', None):
            user['assig_psycho'] = None

        cur.execute('SELECT fk_psycho FROM public.patient WHERE fk_user = %s', (user['user_id'],))
        assig_psycho = cur.fetchone()[0]

        if assig_psycho == user['assig_psycho']:
            cur.execute('UPDATE public.patient SET fk_psycho=%s, appoint_type=%s WHERE fk_user=%s', (user['assig_psycho'], user['appoint_type'] ,user['user_id']))
        else:
            cur.execute('UPDATE public.patient SET fk_psycho=%s, appoint_type=%s, assig_date=%s WHERE fk_user=%s', (user['assig_psycho'], user['appoint_type'], datetime.now(mexico_central) ,user['user_id']))

    conn.commit()

    cur.close()
    conn.close()

    return jsonify({'message' : 'Usuario editado correctamente', 'type' : 'success'})

@user_views.route('/api/delete_user/<int:user_id>', methods = ['DELETE'])
@token_required
def delete_user(user_data, user_id):

    conn = get_db_connection()
    cur = conn.cursor()

    role = user_role(id_user=user_data['id'], cur=cur)

    if role != 'admin':
        cur.close()
        conn.close()
        abort(403)
    
    cur.execute('DELETE FROM public.users WHERE id_user = %s', (user_id,))
    conn.commit()

    return jsonify({'message' : 'Usuario eliminado correctamente', 'type':'success'})


@user_views.route('/api/refresh_token')
def refresh_token():
    refresh_token = request.cookies.get('ghamaris_refresh')
    
    if not refresh_token:
        return jsonify({'message': 'Inicia sesión para tener acceso a más opciones', 'type': 'info', 'user' : {'role' : None}}), 401
    try:
        payload = jwt.decode(refresh_token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        new_access_token = jwt.encode({
            'id': payload['id'],
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        response = make_response(jsonify({'message': 'Token renovado', 'type': 'success'}))
        response.set_cookie('ghamaris_token', new_access_token, httponly=True, secure=True, samesite='None', max_age=3600)
        return response

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Sesión expirada. Por favor inicia sesión de nuevo', 'type': 'warning', 'user' : {'role' : None}}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Token invalido. Por favor inicia sesión', 'type': 'warning', 'user' : {'role' : None}}), 401