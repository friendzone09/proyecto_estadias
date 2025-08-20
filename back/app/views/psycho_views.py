from flask import Blueprint, jsonify, request, current_app, abort
from datetime import datetime
from babel.dates import format_date

import json
import uuid
import os

from app.models.db import get_db_connection
from app.functions.allowed_file import allowed_file
from werkzeug.utils import secure_filename
from app.decorators.auth import token_required
from app.functions.set_all_false_hours import set_false_hours
from app.functions.update_hour import update_hour
from app.functions.user_role import user_role
from app.models.images_supabase import upload_image_to_supabase

psycho_views = Blueprint('psycho', __name__)

@psycho_views.route('/api/get_psycho_info/<int:id_psycho>', methods= ['GET'])
def get_psychgo_info(id_psycho):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('SELECT * FROM public.psychos_info '
	    'WHERE fk_user = %s' , (id_psycho,))
    
    response = cur.fetchone()

    if not response:
        return jsonify({'type' : 'error', 'message' : 'Error, el usuario no es un psicólogo o no existe'})
    
    body = {'name' : response[1],
            'last_name': response[2],
            'image' : response[4],
            'description' : response[5] 
            }

    cur.close()
    conn.close()

    return jsonify({ 'psycho' : body, 'type' : 'success', 'message' : 'Exito'})

@psycho_views.route('/api/update_psycho_profile', methods=['PUT'])
@token_required
def update_psycho_profile(user_data):

    conn = get_db_connection()
    cur = conn.cursor()

    role = user_role(cur=cur,id_user=user_data['id'])

    if role != 'psycho':
        cur.close()
        conn.close()
        abort(403)

    psycho_id = request.form.get('id')
    name = request.form.get('name')
    last_name = request.form.get('last_name')
    description = request.form.get('description')
    image_file = request.files.get('image')

    if not psycho_id:
        return jsonify({'message': 'ID requerido',
                        'type' : 'error'}), 400
    
    if not name or not last_name:
        return jsonify({'message': 'Faltan credenciales',
                        'type' : 'warning'}), 400
    
    if not description:
        description = 'Sin descripción'

    cur.execute('UPDATE public.users SET user_name = %s, user_last_name = %s WHERE id_user = %s',
                (name, last_name, psycho_id,))
    
    cur.execute('UPDATE public.psycho SET psycho_description = %s WHERE fk_user = %s', (description, psycho_id,))

    if image_file:
        if allowed_file(image_file.filename):
            image_url = upload_image_to_supabase(image_file)

            if image_url:
                cur.execute('UPDATE public.psycho SET psycho_image = %s WHERE fk_user = %s', (image_url, psycho_id,))
        else:
            return jsonify({'message': 'Formato de imagen no permitido', 'type': 'warning'}), 400

    conn.commit()

    cur.execute('SELECT * FROM public.users_show_all_info WHERE id_user=%s', (psycho_id,))

    row = cur.fetchone()

    user = {
        'id' : row[0],
        'name' : row[1],
        'last_name' : row[2],
        'email' : row[3],
        'role' : row[4],
        'phone' : row[5],
        'asig_psycho' : row[7],
        'description' : row[9],
        'image' : row[10],
    }

    print(f'image {user["image"]}')

    cur.close()
    conn.close()

    return jsonify({'message': 'Perfil actualizado correctamente',
                    'type': 'success',
                    'user' : user})

@psycho_views.route('/api/get_laboral_day/<int:id_psycho>/<int:id_day>', methods = ['GET'])
@token_required
def get_laboral_day(user_data,id_psycho,id_day):

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('SELECT fk_day, day_name, laboral_day FROM public.laboral_days '
    'JOIN day ON fk_day = id_day WHERE fk_psycho=%s AND fk_day=%s',(id_psycho, id_day,))

    response = cur.fetchone()

    if not response:
        return {'meessage' : 'El usuario no es un psicologo ó no existe', 'type' :'error'}

    day = {
        'id_day' : response[0],
        'day_name' : response[1],
        'laboral_day' : response[2]
    }

    cur.execute(''' 
    SELECT fk_hour, hour, hour_status FROM public.schedule JOIN hour ON fk_hour = id_hour
    WHERE fk_psycho=%s AND fk_day=%s ORDER BY fk_hour
    ''', (id_psycho, id_day))

    response = cur.fetchall()

    hours = [{'id_hour': r[0], 'hour' : r[1].strftime('%H:%M'), 'hour_status' : r[2]} for r in response]

    return jsonify({'day' : day, 'hours' : hours})

@psycho_views.route('/api/my_psycho_info/<int:id_psycho>/<string:date>')
@token_required
def my_psycho_info(user_data, id_psycho, date):

    try:
        today = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'message': 'Formato de fecha inválido. Usa YYYY-MM-DD.', 'type': 'error'}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    role = user_role(cur=cur, id_user=user_data['id'])

    if role != 'patient':
        return jsonify({'message': 'Acceso denegado', 'type': 'error'})

    cur.execute('SELECT user_phone, user_name, user_last_name FROM public.users_show_all_info WHERE id_user = %s', (id_psycho,))
    psycho_info = cur.fetchone()

    if psycho_info is None:
        return jsonify({'message': 'Psicólogo no encontrado', 'type': 'error'}), 404
    
    cur.execute('SELECT user_name, user_last_name FROM public.users_show_all_info WHERE id_user = %s', (user_data['id'],))
    patient_info = cur.fetchone()

    if patient_info is None:
        return({'message' : 'El paciente no existe', 'type' : 'error'}), 404
    
    cur.execute('SELECT * FROM public.last_appoint  WHERE fk_patient = %s AND fk_psycho = %s AND appoint_date >= %s ORDER BY appoint_date LIMIT %s', (user_data['id'], id_psycho, today, 1,))
    row = cur.fetchone()

    if row:
        normal_date = row[2]
        formated_date = format_date(normal_date, format="long", locale='es') 
        last_hour = row[3].strftime('%H:%M')
    else:
        formated_date = None
        last_hour = None

    cur.close()
    conn.close()

    return jsonify({'psychoPhone': psycho_info[0], 
                    'psychoName' : f'{psycho_info[1]} {psycho_info[2]}', 
                    'patientName' : f'{patient_info[0]} {patient_info[1]}',
                    'lastDate' : formated_date,
                    'lastHour' : last_hour
                    })

@psycho_views.route('/api/update_hours', methods = ['PUT'])
@token_required
def update_hours(user_data):
    conn = get_db_connection()
    cur = conn.cursor()

    role = user_role(cur=cur, id_user=user_data['id'])

    if role != 'psycho':
        cur.close()
        conn.close()
        abort(403)

    id_day = request.form.get('id_day')
    laboral_day = request.form.get('laboral_day') == 'true'
    psycho_id = request.form.get('psycho_id')
    modified_hours_json = request.form.get('modified_hours')

    modified_hours = json.loads(modified_hours_json)

    if not laboral_day:
        response = set_false_hours(cur=cur, id_day= id_day, id_psycho= psycho_id)

        conn.commit()

        cur.close()
        conn.close()

        return jsonify (response)
    
    cur.execute('''
        UPDATE public.laboral_days
        SET  laboral_day=%s
        WHERE fk_psycho=%s AND fk_day=%s;
    ''', (True, psycho_id, id_day,))
    
    for hour in modified_hours:
        update_hour(cur=cur,id_hour=hour['id_hour'], id_psycho=psycho_id, id_day= id_day, status= hour['hour_status'])

    conn.commit()

    cur.close()
    conn.close()

    return jsonify ({'message' : 'Horario cambiado con exito',
                     'type' : 'success'}), 200

@psycho_views.route('/api/my-patients')
@token_required
def my_patients(user_data):
    conn = get_db_connection()
    cur = conn.cursor()

    role = user_role(cur=cur, id_user=user_data['id'])

    if role != 'psycho':
        cur.close()
        conn.close()
        abort(403)

    # Obtener parámetros de paginación
    page = int(request.args.get('page', 1))  # Página actual (default 1)
    per_page = int(request.args.get('per_page', 5))  # Elementos por página (default 5)
    search = request.args.get('search','') # Elemento a buscar (Si existe)
    offset = (page - 1) * per_page

    if search == 'none':
        # Contar total de usuarios
        cur.execute("SELECT COUNT(*) FROM public.users_show_all_info WHERE assigned_psychologist_id = %s", (user_data['id'],))
        total_users = cur.fetchone()[0]

        # Consulta paginada
        cur.execute('''
            SELECT * FROM public.users_show_all_info
            WHERE assigned_psychologist_id = %s
            ORDER BY user_name
            LIMIT %s OFFSET %s
        ''', (user_data['id'], per_page, offset))

        rows = cur.fetchall()
        users = [{'user_id': r[0], 'user_name': r[1], 'user_last_name': r[2], 'user_email': r[3], 
                  'user_phone': r[5], 'user_age' : r[6], 'appoint_type': r[8]} for r in rows]

        return jsonify({
            'users': users,
            'total': total_users,
            'page': page,
            'per_page': per_page
        })
    
    else:
        #Consulta de total de paginas en la busqueda
        cur.execute('''SELECT COUNT(*) 
                    FROM public.users_show_all_info 
                    WHERE assigned_psychologist_id = %s 
                    AND(user_name ILIKE %s OR user_last_name ILIKE %s
                    OR (user_name || ' ' || user_last_name) ILIKE %s
                    OR user_email ILIKE %s)''', 
                    (user_data['id'], f'{search}%', f'%{search}%', f'{search}%', f'{search}'))
        total_users = cur.fetchone()[0]

        #Consulta de usuarios
        cur.execute(
        '''SELECT * FROM public.users_show_all_info
        WHERE assigned_psychologist_id = %s 
        AND (user_name ILIKE %s
        OR user_last_name ILIKE %s 
        OR (user_name || ' ' || user_last_name) ILIKE %s
        OR user_email ILIKE %s)
        ORDER BY user_name LIMIT %s OFFSET %s''',
        (user_data['id'], f'{search}%', f'%{search}%', f'{search}%', f'{search}%', per_page, offset))

        rows = cur.fetchall()
        users = [{'user_id': r[0], 'user_name': r[1], 'user_last_name': r[2], 'user_email': r[3], 
                  'user_phone': r[5], 'user_age' : r[6], 'appoint_type': r[8]} for r in rows]
        return jsonify({
            'users': users,
            'total' : total_users,
            'page' : page,
            'per_page' : per_page
        })