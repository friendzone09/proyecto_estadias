from flask import Flask, jsonify, send_from_directory, request
from dotenv import load_dotenv
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
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

app = Flask(__name__)

CORS(app)

load_dotenv()

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def hello_world():
    return "<p>Hello world</p>"

@app.route('/psychos')
def get_psychos():

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM public.psycho ORDER BY id_psychologist ASC ')
    rows = cur.fetchall()

    psychos = []

    for row in rows:
        psychos.append({
            'id': row[0],
            'name': row[1],
            'last_name' : row[2],
            'email' : row[3],
            'image' : row[6],
            'description' : row[7]
        })

    return jsonify(psychos)

def get_user(email):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM public.psycho WHERE psycho_email = %s', (email,))  

    user = cur.fetchone()

    if not user:
        return False
    
    return True

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    if not email or not password:
        return jsonify({'message' : 'Faltan credenciales', 'type' : 'error'}), 401

    if not get_user(email):
        type = False
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM public.patient WHERE patient_email = %s',(email,))

        row = cur.fetchone()

        if not row:
            return jsonify({'message' : 'El usuario no existe',
                            'type' : 'error'}), 401
        
        if not check_password_hash(row[4], password):
            return jsonify({'message': 'La contraseña es incorrecta',
                            'type' : 'error'}), 401
        
        user = {
            'user_id' : row[0],
            'name' : row[1],
            'last_name' : row[2],
            'email' : row[3],
            'type' : type,
            'psycho' : row[6]
        }

        return jsonify({'message' : 'El usuario es un paciente', 
                        'user' : user,
                        'type' : 'success'
                        })
    
    type = True
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM public.psycho WHERE psycho_email = %s',(email,))
   
    row = cur.fetchone()

    if not check_password_hash(row[4], password):
            return jsonify({'message': 'La contraseña es incorrecta',
                            'type' : 'error'})
  
    user = {
        'user_id' : row[0],
        'name' : row[1],
        'last_name' : row[2],
        'email' : row[3],
        'type' : type,
        'image' : row[6]
    }

    return jsonify({'message' : 'El usuario es un psicologo',
                    'user' : user,
                    'type' : 'success'})

@app.route('/re_login', methods = ['POST'])
def re_login():
    user_id = request.form.get('id')

    type = False
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM public.patient WHERE id_patient = %s',(user_id,))

    row = cur.fetchone()

    if not row:
        return jsonify({'message' : 'El usuario no existe'}), 401
        
    user = {
            'user_id' : row[0],
            'name' : row[1],
            'last_name' : row[2],
            'email' : row[3],
            'type' : type,
            'psycho' : row[6]
        }

    return jsonify({'message' : 'El usuario es un paciente', 'user' : user})

    
@app.route('/register', methods = ['POST'])
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
    cur.execute('SELECT * FROM public.psycho WHERE psycho_email = %s',(email,))
   
    row1 = cur.fetchone()

    cur.execute('SELECT * FROM public.patient WHERE patient_email = %s',(email,))

    row2 = cur.fetchone()

    if row1 or row2:
        return jsonify({'message': 'El usuario ya existe',
                        'type' : 'error'}), 401
    
    password = generate_password_hash(password)

    cur.execute('INSERT INTO public.patient( '
	 'patient_name, patien_last_name, patient_email, patient_password) '
	'VALUES (%s, %s, %s, %s)', (name, last_name, email, password))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message' : 'Usuario registrado correctamente',
                    'type' : 'success'})

@app.route('/get_appoint_for_patient', methods = ['POST'])
def obtain_appoint():

    psycho_id = request.form.get('id')
    date_str = request.form.get('date')

    if not psycho_id or not date_str:
        return jsonify({'message': 'Error',
                        'type': 'errpr'}), 401

    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    result = get_schedule(psycho_id, date)   

    if not result:
        return jsonify({'schedule' : []})

    schedule = [{'id': h[0], 'hour': h[1].strftime('%H:%M')} for h in result]

    result = get_appoint(psycho_id, date)

    appoints = []

    if result:
        appoints = [{'hour': h[4], 'status' : h[5]} for h in result]  
    
    new_schedule = sort_appoints(schedule, appoints)

    return jsonify({'schedule': new_schedule}), 200


@app.route('/get_psycho', methods = ['POST'])
def get_psycho():

    id_psycho = request.form.get('id')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT psycho_name, psycho_last_name FROM public.psycho WHERE id_psychologist = %s',(id_psycho,))

    row = cur.fetchone()

    psycho = {
        'name' : row[0],
        'last_name' : row[1]
    }

    return jsonify(psycho)

@app.route('/insert_appoint', methods = ['POST'])
def call_insert_appoint():

    id_psycho = request.form.get('psycho_id')
    date_str = request.form.get('date')
    patient_id = request.form.get('patient_id')
    hour_id = request.form.get('hour_id')

    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    result = insert_appoint(id_psycho, patient_id, date, hour_id)

    if result == False :
        print('El usuario no puede registrar mas citas.')
        return jsonify({'message' : 'Error, no puedes hacer mas registros',
                        'type' : 'error'}), 400 
        

    return jsonify({'message' : 'Cita agendada',
                    'type' : 'success'}), 200

@app.route('/cancel_appoint', methods = ['POST'])
def call_cancel_appoint():

    id_psycho = request.form.get('psycho_id')
    date_str = request.form.get('date')
    hour_id = request.form.get('hour_id')

    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    response = cancel_appoint(id_psycho, date, hour_id)

    return response

@app.route('/activate_appoint', methods = ['POST'])
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

@app.route('/get_psychgo_info', methods= ['POST'])
def get_psychgo_info():
    id_psycho = request.form.get('id')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM public.psycho '
	    'WHERE id_psychologist = %s' , (id_psycho,))
    
    response = cur.fetchone()

    body = {'name' : response[1],
            'last_name': response[2],
            'image' : response[6],
            'description' : response[7] 
            }

    cur.close()
    conn.close()

    return jsonify(body)

@app.route('/update_psycho_profile', methods=['POST'])
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

    cur.execute('UPDATE public.psycho SET psycho_name = %s, psycho_last_name = %s, psycho_description = %s WHERE id_psychologist = %s',
                (name, last_name, description, psycho_id))

    if image_file and allowed_file(image_file.filename):
        filename = secure_filename(image_file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        if not os.path.exists(filepath):
            image_file.save(filepath)

        cur.execute('UPDATE public.psycho SET psycho_image = %s WHERE id_psychologist = %s', (filename, psycho_id))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Perfil actualizado correctamente',
                    'type': 'success'})

@app.route('/relogin_psycho', methods = ['POST'])
def re_login_psycho():
    psycho_id = request.form.get('id')

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('SELECT * FROM public.psycho WHERE id_psychologist = %s',(psycho_id,))
   
    row = cur.fetchone()

    user = {
            'user_id' : row[0],
        'name' : row[1],
        'last_name' : row[2],
        'email' : row[3],
        'type' : True,
        'image' : row[6]
        }

    return jsonify({'message' : 'El usuario es un paciente', 'user' : user})

@app.route('/get_laboral_day', methods = ['POST'])
def get_laboral_day():
    id_day = request.form.get('id_day')
    id_psycho = request.form.get('id_psycho')

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('SELECT fk_day, day_name, laboral_day FROM public.laboral_days '
    'JOIN day ON fk_day = id_day WHERE fk_psycho=%s AND fk_day=%s',(id_psycho, id_day,))

    response = cur.fetchone()

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


@app.route('/update_hours', methods = ['PUT'])
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

@app.route('/check_password', methods = ['POST'])
def check_password():

    data = request.get_json()

    send_password = data.get('password')
    psycho_id = data.get('id')

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('SELECT psycho_password FROM public.psycho WHERE id_psychologist = %s' , (psycho_id,))

    hashed_pass = cur.fetchone()[0]

    if check_password_hash(hashed_pass, send_password):
        print('Es la misma')
        return jsonify({'message' : 'Correcto',
                        'type' : 'success'})
    else:
        print('No es la misma')
        return jsonify ({'message' : 'Incorrecto',
                        'type' : 'error'})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ =='__main__':
    app.run(debug=True, port = 5000)