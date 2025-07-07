from flask import Blueprint, jsonify, request, current_app, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

import jwt

from app.models.db import get_db_connection
from app.decorators.auth import token_required

home_views = Blueprint('home', __name__)

@home_views.route('/api/psychos')
def get_psychos():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM public.psychos_info ORDER BY fk_user ASC')
    rows = cur.fetchall()

    psychos = []

    for row in rows:
        psychos.append({
            'id': row[0],
            'name': row[1],
            'last_name' : row[2],
            'email' : row[3],
            'image' : row[4],
            'description' : row[5]
        })

    return jsonify(psychos)

@home_views.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message' : 'Faltan credenciales', 'type' : 'error'}), 401
    
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('SELECT * FROM public.users WHERE user_email = %s', (email,))

    user_info = cur.fetchone()

    if not user_info:
        cur.close()
        conn.close()
        return jsonify({'message': 'Usuario no encontrado', 'type': 'error'}), 404

    if not check_password_hash(user_info[4], password):
        cur.close()
        conn.close()
        return jsonify({'message' : 'Error: contraseña incorrecta', 'type' : 'error'})
    
    # access token
    access_token = jwt.encode({
        'id': user_info[0],
        'exp': datetime.utcnow() + timedelta(hours=1)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')

    # refresh token (dura más)
    refresh_token = jwt.encode({
        'id': user_info[0],
        'exp': datetime.utcnow() + timedelta(days=14)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')
    
    response = make_response(jsonify({'message': 'Login exitoso', 'type' : 'success'}))

    response.set_cookie(
        'ghamaris_token',
        access_token,
        httponly=True,
        secure=True,
        samesite='None',
        max_age=3600
    )

    response.set_cookie(
        'ghamaris_refresh', 
        refresh_token, 
        httponly=True, 
        secure=True, 
        samesite='None', 
        max_age=14*24*3600
    )
        
    cur.close()
    conn.close()

    return response
    
@home_views.route('/api/register', methods = ['POST'])
def register():

    name = request.form.get('name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    password = request.form.get('password')
    psycho_id = request.form.get('psycho_id')

    if psycho_id in ('', 'null', None):
        psycho_id = None

    if not name or not last_name or not email or not phone or not password:
        return jsonify({'message' : 'Faltan credenciales',
                        'type' : 'error'}), 401
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT user_email FROM public.users WHERE user_email = %s',(email,))
   
    row = cur.fetchone()

    if row:
        return jsonify({'message': 'El correo electronico ya existe',
                        'type' : 'error'}), 401
    
    password = generate_password_hash(password)

    cur.execute('INSERT INTO public.users( '
	 'user_name, user_last_name, user_email, user_password, user_phone) '
	'VALUES (%s, %s, %s, %s, %s) RETURNING id_user ', (name, last_name, email, password, phone,))

    new_user_id = cur.fetchone()[0]

    if psycho_id:
        print(psycho_id)
        cur.execute('UPDATE public.patient SET fk_psycho=%s WHERE fk_user=%s', (psycho_id, new_user_id,))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message' : 'Usuario registrado correctamente',
                    'type' : 'success'})

@home_views.route('/api/get_all_user_info')
@token_required
def get_all_user_info(user_data):
    try:
        id_user = user_data['id']

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM public.users_show_all_info WHERE id_user = %s', (id_user,))
        row = cur.fetchone()

        user = {
            'id' : row[0],
            'name' : row[1],
            'last_name' : row[2],
            'email' : row[3],
            'role' : row[4],
            'phone' : row[5],
            'asig_psycho' : row[6],
            'description' : row[7],
            'image' : row[8],
        }

        cur.close()
        conn.close()

        return jsonify({'user' : user, 'message' : 'Exito', 'type' : 'success'})

    except jwt.ExpiredSignatureError:
        response = make_response(jsonify({'message': 'Token exipirado', 'user' : {'role' : None}, 'type' : 'warning' }))
        response.set_cookie(
            'ghamaris_token',
            '',                # Borra el valor
            max_age=0,         # Expira inmediatamente
            expires=0,         # También establece la fecha de expiración en 0
            httponly=True,     # Seguridad: no accesible desde JS
            secure=True,      # Pon True en producción (HTTPS)
            samesite='None'
        )  # Borra la cookie
        return response
    
@home_views.route('/api/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Logout exitoso', 'type': 'success'}))

    # Borrar el access token
    response.set_cookie('ghamaris_token', '', expires=0, httponly=True, secure=True, samesite='None')

    # Borrar también el refresh token
    response.set_cookie('ghamaris_refresh', '', expires=0, httponly=True, secure=True, samesite='None')

    return response