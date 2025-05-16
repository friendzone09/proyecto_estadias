from flask import Flask, jsonify, send_from_directory, request
from dotenv import load_dotenv
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

import os
import psycopg2


app = Flask(__name__)

CORS(app)

load_dotenv()

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db_connection():
    try:
        conn=psycopg2.connect(host='localhost',
                              dbname='agend_test1',
                              port='5432',
                              user = os.getenv('DB_USER'),
                              password =os.getenv('DB_PASSWORD'),
                              )
        return conn
    except psycopg2.Error as error:
        print(f"Base de datos no encontrada {error}")
        return None

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
            'type' : type
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

@app.route('/get_schedule', methods = ['POST'])
def obtain_schedule():

    psycho_id = request.form.get('id')
    date_str = request.form.get('date')

    conn = get_db_connection()
    cur = conn.cursor()

    try:

        date = datetime.strptime(date_str, "%Y-%m-%d").date()
        day_week = date.weekday() + 1

    except ValueError:
        return jsonify({'message' : 'Error'}), 400
    
    query = '''
        SELECT id_hour, hour, psycho_name, psycho_last_name
        FROM schedule s
        JOIN hour h ON s.fk_hour = h.id_hour
        JOIN psycho p ON s.fk_psycho = p.id_psychologist
        WHERE s.fk_psycho = %s
        AND s.fk_day = %s
        AND s.hour_status = true
        ORDER BY h.hour;
    '''

    cur.execute(query, (psycho_id, day_week,))
    result = cur.fetchall()

    if not result:
        return jsonify({'message' : 'No disponible'})

    data = [{'id': h[0], 'hour': h[1].strftime('%H:%M')} for h in result]

    cur.close()
    conn.close()

    return jsonify({'schedule': data}), 200

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

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ =='__main__':
    app.run(debug=True, port = 5000)