from flask import Blueprint, jsonify, request, abort
from datetime import datetime

from app.functions.get_schedule import get_schedule
from app.functions.get_appoints import get_appoint
from app.functions.sort_appoints import sort_appoints
from app.functions.insert_appoint import insert_appoint
from app.functions.cancel_appoint import cancel_appoint
from app.models.db import get_db_connection
from app.decorators.auth import token_required
from app.functions.user_role import user_role

appoint_viwes = Blueprint('appints', __name__)

@appoint_viwes.route('/api/get_appoint_for_patient/<int:psycho_id>/<string:date_str>')
def obtain_appoint(psycho_id, date_str):

    if not psycho_id or not date_str:
        return jsonify({'message': 'Error, faltan credenciales',
                        'type': 'error'}), 401

    #Se le da formato a la fecha enviada
    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    #Obtener el horario del psicólogo en el día enviado
    result = get_schedule(psycho_id, date)   
    #Si el result es False regresa un mensaje de error
    if result == False:
        return jsonify({'message' : 'El usuario no es un psicologo o no existe', 'type':'error'})
    
    #Regresa un array vacio, indicando que no es un día laborable
    if not result:
        return jsonify({'schedule' : []}), 200
    #Ordenamos el horario del día.
    schedule = [{'id': r[0], 'hour': r[1].strftime('%H:%M')} for r in result]

    #Obtener las citas del día
    result = get_appoint(psycho_id, date)

    appoints = []

    #Si hay citas en el día se ordena lo que obtuvimos en get_appoint
    if result:
        appoints = [{'hour': h[0], 'status' : h[1], 'date': h[2], 'name' : h[3], 'last_name' : h[4]} for h in result]  
    
    #Se ordenan la citas y el horario del psicólogo
    new_schedule = sort_appoints(schedule, appoints)

    #Regresa el horario de la decha seleccionada.
    return jsonify({'schedule': new_schedule}), 200

@appoint_viwes.route('/api/insert_appoint', methods = ['POST'])
@token_required
def post_appoint(user_data):

    #Obtenemos todos los datos para agendar una cita
    type = request.form.get('user_type')
    id_psycho = request.form.get('psycho_id')
    date_str = request.form.get('date')
    patient_id = request.form.get('patient_id')
    hour_id = request.form.get('hour_id')
    date = datetime.strptime(date_str, "%Y-%m-%d").date()
    
    #Intentamos hacer el insert de la Cita
    result = insert_appoint(id_psycho, patient_id, date, hour_id, type)
    #Si la función regresa Flase regresamos un error 403 al Front
    if result == False :
        abort(403)
    #Regresamos un mensaje de éxito
    return jsonify({'message' : 'Cita agendada',
                    'type' : 'success'}), 200

@appoint_viwes.route('/api/cancel_appoint', methods = ['POST'])
@token_required
def call_cancel_appoint(user_data):
    #Obtenemos los datos para cancelar una cita
    id_psycho = request.form.get('psycho_id')
    date_str = request.form.get('date')
    hour_id = request.form.get('hour_id')

    date = datetime.strptime(date_str, "%Y-%m-%d").date()
    #Intentamos cancelar la cita
    response = cancel_appoint(id_psycho, date, hour_id)
    #Regresamos el mensaje que nos regresa cancel_appoint
    return response

@appoint_viwes.route('/api/activate_appoint', methods = ['POST'])
@token_required
def activate_appoint(user_data):
    #Obtenemos los datos para reactivar la hora
    id_psycho = request.form.get('psycho_id')
    date_str = request.form.get('date')
    hour_id = request.form.get('hour_id')

    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    conn = get_db_connection()
    cur = conn.cursor()
    #Aqui simplemente borramos la cita cancelada, así en obtain_appoint volvera a regresar un estado de null
    cur.execute('DELETE FROM public.appointments '
	    'WHERE fk_psycho = %s AND appoint_date = %s AND fk_hour = %s' , (id_psycho, date, hour_id))
    
    conn.commit()
    cur.close()
    conn.close()
    #Regresamos un mensaje de éxito 
    return jsonify({'message' : 'Hora reactivada correctamente',
                    'type' : 'success'})

@appoint_viwes.route('/api/get_patients/<int:id_psycho>')
@token_required
def get_patients(user_data, id_psycho):

    conn = get_db_connection()
    cur = conn.cursor()
    #Obtenemos el role del usuario que hace la petición
    role = user_role(cur=cur, id_user=user_data['id'])
    #Si el role es de un paciente retornamos un error de autorización
    if role == "patient":
        abort(403)
    #Obtenemos los pacientes del psicólogo
    cur.execute('SELECT fk_user, user_name, user_last_name FROM public.patient JOIN users ON fk_user = id_user WHERE fk_psycho = %s '
    'ORDER BY user_name, user_last_name' , (id_psycho,))
    row = cur.fetchall()
    #Ordenamos los pacientes en un array de objetos
    patients = [{'id_patient': r[0], 'name': r[1], 'last_name' : r[2]} for r in row]
    #Regresamos los pacientes
    return jsonify(patients)