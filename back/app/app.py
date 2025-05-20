from flask import Flask, jsonify, send_from_directory, request
from dotenv import load_dotenv
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

from app.db import get_db_connection
from app.functions.get_schedule import get_schedule
from app.functions.get_appoints import get_appoint
from app.functions.sort_appoints import sort_appoints
from app.functions.insert_appoint import insert_appoint

app = Flask(__name__)

CORS(app)

load_dotenv()

UPLOAD_FOLDER = 'uploads'
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
        return jsonify({'message' : 'Faltan credenciales'}), 401

    if not get_user(email):
        type = False
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM public.patient WHERE patient_email = %s',(email,))

        row = cur.fetchone()

        if not row:
            return jsonify({'message' : 'El usuario no existe'}), 401
        
        if not check_password_hash(row[4], password):
            return jsonify({'message': 'La contraseña es incorrecta'}), 401
        
        user = {
            'user_id' : row[0],
            'name' : row[1],
            'last_name' : row[2],
            'email' : row[3],
            'type' : type,
            'psycho' : row[6]
        }

        return jsonify({'message' : 'El usuario es un paciente', 'user' : user})
    
    type = True
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM public.psycho WHERE psycho_email = %s',(email,))
   
    row = cur.fetchone()

    if not check_password_hash(row[4], password):
            return jsonify({'message': 'La contraseña es incorrecta'})
  
    user = {
        'user_id' : row[0],
        'name' : row[1],
        'last_name' : row[2],
        'email' : row[3],
        'type' : type,
        'image' : row[6]
    }

    return jsonify({'message' : 'El usuario es un psicologo', 'user' : user})

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
        return jsonify({'message' : 'Faltan credenciales'}), 401
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM public.psycho WHERE psycho_email = %s',(email,))
   
    row1 = cur.fetchone()

    cur.execute('SELECT * FROM public.patient WHERE patient_email = %s',(email,))

    row2 = cur.fetchone()

    if row1 or row2:
        return jsonify({'message': 'El usuario ya existe'}), 401
    
    password = generate_password_hash(password)

    cur.execute('INSERT INTO public.patient( '
	 'patient_name, patien_last_name, patient_email, patient_password) '
	'VALUES (%s, %s, %s, %s)', (name, last_name, email, password))


    return jsonify({'message' : 'Usuario registrado correctamente'})

@app.route('/get_appoint_for_patient', methods = ['POST'])
def obtain_appoint_for_patient():

    psycho_id = request.form.get('id')
    date_str = request.form.get('date')

    if not psycho_id or not date_str:
        return jsonify({'message': 'Error'}), 401

    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    result = get_schedule(psycho_id, date)   

    if not result:
        return jsonify({'message' : 'No disponible'})

    schedule = [{'id': h[0], 'hour': h[1].strftime('%H:%M')} for h in result]

    result = get_appoint(psycho_id, date)

    appoints = []

    if result:
        appoints = [{'hour': h[4]} for h in result]  
    
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

    insert_appoint(id_psycho, patient_id, date, hour_id)

    return jsonify({'message' : 'Cita agendada'}), 200


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ =='__main__':
    app.run(debug=True, port = 5000)