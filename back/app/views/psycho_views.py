from flask import Blueprint, jsonify, request, current_app, abort

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

    role= user_role(cur=cur,id_user=user_data['id'])

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

    if image_file and allowed_file(image_file.filename):
        random_prefix = str(uuid.uuid4())
        filename = f"{random_prefix}_{secure_filename(image_file.filename)}"
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)\
        
        image_file.save(filepath)

        cur.execute('UPDATE public.psycho SET psycho_image = %s WHERE fk_user = %s', (filename, psycho_id,))

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
        'asig_psycho' : row[6],
        'description' : row[7],
        'image' : row[8],
    }

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

@psycho_views.route('/api/my_psycho_info/<int:id_psycho>')
@token_required
def my_psycho_info(user_data, id_psycho):
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

    return jsonify({'psychoPhone': psycho_info[0], 
                    'psychoName' : f'{psycho_info[1]} {psycho_info[2]}', 
                    'patietnName' : f'{patient_info[0]} {patient_info[1]}' 
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