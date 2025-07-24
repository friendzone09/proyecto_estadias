from app.models.db import get_db_connection
def insert_appoint(id_psycho, patient_id, date, hour_id, type):

    conn = get_db_connection()
    cur = conn.cursor()

    #Obtenemos los datos del paciente que quiere agendar la cita
    query = 'SELECT * FROM public.patient WHERE fk_user = %s'
    cur.execute(query, (patient_id,))
    result = cur.fetchone()

    #Obtenemos si ya hay una cita agendada para ese dia y hora
    cur.execute('SELECT * FROM public.appointments '
    'WHERE appoint_date=%s AND fk_hour=%s', (date, hour_id))
    appoint = cur.fetchone()
    #Si hay una cita ya agendada regresamos False
    if appoint:
        return False
    #Si el uusario que hace el insert es "patient" y ya tiene un psicólogo asignado regresamos False
    if type == 'patient' and result[1]:
        return False
    #Hacemos el insert de la cita
    cur.execute('INSERT INTO public.appointments( '
	'fk_psycho, fk_patient, appoint_date, fk_hour, appoint_status) '
	'VALUES (%s, %s, %s, %s, %s);',(id_psycho, patient_id, date, hour_id, True,))
    #Si el paciente no tenia un psicólogo asignado, lo actulizamos asignandole uno 
    if result[1] == None:
        cur.execute('UPDATE public.patient '
        'SET fk_psycho=%s '
        'WHERE fk_user=%s;' , (id_psycho, patient_id,))

    conn.commit()
    cur.close()
    conn.close()

    return True