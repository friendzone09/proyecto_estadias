from flask import Flask, jsonify, send_from_directory, request, make_response
from dotenv import load_dotenv
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt

import uuid
import os
import json

from app.db import get_db_connection
from app.functions.get_schedule import get_schedule
from app.functions.get_appoints import get_appoint
from app.functions.sort_appoints import sort_appoints
from app.functions.insert_appoint import insert_appoint
from app.functions.cancel_appoint import cancel_appoint
from app.functions.set_all_false_hours import set_false_hours
from app.functions.update_hour import update_hour

# password = generate_password_hash('12345')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super_secret_password'

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

load_dotenv()

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/")
def hello_world():
    return "<p>Hello world</p>"

@app.route('/api/psychos')
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

@app.route('/api/login', methods=['POST'])
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
    
    token = jwt.encode({
        'id': user_info[0],
        'exp': datetime.utcnow() + timedelta(hours=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    print(token)
    
    response = make_response(jsonify({'message': 'Login exitoso', 'type' : 'success'}))
    response.set_cookie(
        'ghamaris_token',
        token,
        httponly=True,
        secure=False,  # True en producción (HTTPS)
        samesite='Lax',
        max_age=3600
    )
        
    cur.close()
    conn.close()

    return response
    
@app.route('/api/register', methods = ['POST'])
def register():

    name = request.form.get('name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')
    password = request.form.get('password')

    if not name or not last_name or not email or not password:
        return jsonify({'message' : 'Faltan credenciales',
                        'type' : 'error'}), 401
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT user_email FROM public.users WHERE user_email = %s',(email,))
   
    row = cur.fetchone()

    if row:
        return jsonify({'message': 'El usuario ya existe',
                        'type' : 'error'}), 401
    
    password = generate_password_hash(password)

    cur.execute('INSERT INTO public.users( '
	 'user_name, user_last_name, user_email, user_password) '
	'VALUES (%s, %s, %s, %s) RETURNING id_user ', (name, last_name, email, password))


    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message' : 'Usuario registrado correctamente',
                    'type' : 'success'})

@app.route('/api/get_appoint_for_patient/<int:psycho_id>/<string:date_str>', methods = ['GET'])
def obtain_appoint(psycho_id, date_str):

    if not psycho_id or not date_str:
        return jsonify({'message': 'Error',
                        'type': 'error'}), 401

    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    result = get_schedule(psycho_id, date)   

    if result == False:
        return jsonify({'message' : 'El usuario no es un psicologo o no existe', 'type':'error'})

    if not result:
        return jsonify({'schedule' : []})

    schedule = [{'id': r[0], 'hour': r[1].strftime('%H:%M')} for r in result]

    result = get_appoint(psycho_id, date)

    appoints = []

    if result:
        appoints = [{'hour': h[0], 'status' : h[1], 'date': h[2], 'name' : h[3], 'last_name' : h[4]} for h in result]  
    
    new_schedule = sort_appoints(schedule, appoints)

    return jsonify({'schedule': new_schedule}), 200


@app.route('/api/get_psycho/<int:id_psycho>', methods = ['GET'])
def get_psycho(id_psycho):

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT user_name, user_last_name FROM public.psychos_info WHERE fk_user = %s',(id_psycho,))

    row = cur.fetchone()

    psycho = {
        'name' : row[0],
        'last_name' : row[1]
    }

    return jsonify(psycho)

@app.route('/api/insert_appoint', methods = ['POST'])
def post_appoint():

    type = request.form.get('user_type')

    id_psycho = request.form.get('psycho_id')
    date_str = request.form.get('date')
    patient_id = request.form.get('patient_id')
    hour_id = request.form.get('hour_id')

    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    result = insert_appoint(id_psycho, patient_id, date, hour_id, type)

    if result == False :
        return jsonify({'message' : 'Error, no puedes hacer mas registros',
                        'type' : 'error'}), 400 

    return jsonify({'message' : 'Cita agendada',
                    'type' : 'success',
                    'user'  : result}), 200

@app.route('/api/cancel_appoint', methods = ['POST'])
def call_cancel_appoint():

    id_psycho = request.form.get('psycho_id')
    date_str = request.form.get('date')
    hour_id = request.form.get('hour_id')

    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    response = cancel_appoint(id_psycho, date, hour_id)

    return response

@app.route('/api/activate_appoint', methods = ['POST'])
def activate_appoint():

    id_psycho = request.form.get('psycho_id')
    date_str = request.form.get('date')
    hour_id = request.form.get('hour_id')

    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM public.appointments '
	    'WHERE fk_psycho = %s AND appoint_date = %s AND fk_hour = %s' , (id_psycho, date, hour_id))
    
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message' : 'Hora reactivada correctamente',
                    'type' : 'success'})

@app.route('/api/get_all_user_info')
def get_all_user_info():
    token = request.cookies.get('ghamaris_token')

    if not token:
        return jsonify({'message': 'Token no encontrado', 'type': 'success', 'user' : {'role' : None}})
    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        id_user = decoded['id']

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
            'asig_psycho' : row[5],
            'description' : row[6],
            'image' : row[7],
        }

        cur.close()
        conn.close()

        return jsonify({'user' : user, 'message' : 'Exito', 'type' : 'success'})

    except jwt.ExpiredSignatureError:
        response = make_response(jsonify({'message': 'Token exipirado', 'user' : {'role' : None}, 'type' : 'success' }))
        response.set_cookie(
            'ghamaris_token',
            '',                # Borra el valor
            max_age=0,         # Expira inmediatamente
            expires=0,         # También establece la fecha de expiración en 0
            httponly=True,     # Seguridad: no accesible desde JS
            secure=False,      # Pon True en producción (HTTPS)
            samesite='Lax'
        )  # Borra la cookie
        return response

@app.route('/api/get_psycho_info/<int:id_psycho>', methods= ['GET'])
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

@app.route('/api/update_psycho_profile', methods=['PUT'])
def update_psycho_profile():
    psycho_id = request.form.get('id')
    name = request.form.get('name')
    last_name = request.form.get('last_name')
    description = request.form.get('description')
    image_file = request.files.get('image')

    if not psycho_id:
        return jsonify({'message': 'ID requerido',
                        'type' : 'error'}), 400
    
    if not name or not last_name:
        return jsonify({'message': 'No llenaste todas las credenciales',
                        'type' : 'error'}), 400
    
    if not description:
        description = 'Sin descripción'

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('UPDATE public.users SET user_name = %s, user_last_name = %s WHERE id_user = %s',
                (name, last_name, psycho_id,))
    
    cur.execute('UPDATE public.psycho SET psycho_description = %s WHERE fk_user = %s', (description, psycho_id,))

    if image_file and allowed_file(image_file.filename):
        random_prefix = str(uuid.uuid4())
        filename = f"{random_prefix}_{secure_filename(image_file.filename)}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)\
        
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
        'asig_psycho' : row[5],
        'description' : row[6],
        'image' : row[7],
    }

    cur.close()
    conn.close()

    return jsonify({'message': 'Perfil actualizado correctamente',
                    'type': 'success',
                    'user' : user})

@app.route('/api/get_laboral_day/<int:id_psycho>/<int:id_day>', methods = ['GET'])
def get_laboral_day(id_psycho,id_day):

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

@app.route('/api/update_hours', methods = ['PUT'])
def update_hours():
    conn = get_db_connection()
    cur = conn.cursor()

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

@app.route('/api/check_password', methods = ['POST'])
def check_password():

    data = request.get_json()

    send_password = data.get('password')
    psycho_id = data.get('id')

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('SELECT user_password FROM public.users WHERE id_user = %s' , (psycho_id,))

    hashed_pass = cur.fetchone()[0]

    if check_password_hash(hashed_pass, send_password):
        return jsonify({'message' : 'Correcto',
                        'type' : 'success'})
    else:
        return jsonify ({'message' : 'Incorrecto',
                        'type' : 'error'})
    
@app.route('/api/get_patients/<int:id_psycho>')
def get_patients(id_psycho):

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT fk_user, user_name, user_last_name FROM public.patient JOIN users ON fk_user = id_user WHERE fk_psycho = %s '
    'ORDER BY user_name, user_last_name' , (id_psycho,))
    row = cur.fetchall()

    patients = [{'id_patient': r[0], 'name': r[1], 'last_name' : r[2]} for r in row]

    return jsonify(patients)

@app.route('/api/check_token')
def check_token():
    print('Cookies:', request.cookies)
    token = request.cookies.get('ghamaris_token')
    if not token:
        return jsonify({'ok': False, 'msg': 'No token'})
    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return jsonify({'ok': True, 'user_id': decoded['id']})
    except jwt.ExpiredSignatureError:
        return jsonify({'ok': False, 'msg': 'Token expirado'})
    
@app.route('/api/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'mensaje': 'Logout exitoso'}))
    response.set_cookie('ghamaris_token', '', expires=0)  # Borra la cookie
    return response

@app.route('/api/user_info')
def get_user_info():
    token = request.cookies.get('ghamaris_token')

    if not token:
        return jsonify({'message': 'Token no encontrado', 'type': 'success', 'user' : None})
    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        id_user = decoded['id']

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM public.users WHERE id_user = %s', (id_user,))
        row = cur.fetchone()
        user = {
            'id' : row[0],
            'name' : row[1],
            'last_name' : row[2],
            'email' : row[3],
            'role' : row[5]

        }

        return jsonify({'user' : user, 'message' : 'Exito', 'type' : 'success'})

    except jwt.ExpiredSignatureError:
        return jsonify({'ok': False, 'msg': 'Token expirado'})
    
    finally:
        cur.close()
        conn.close()

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ =='__main__':
    app.run(host="localhost", port=5000, debug=True)