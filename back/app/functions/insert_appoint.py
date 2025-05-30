from app.db import get_db_connection
def insert_appoint(id_psycho, patient_id, date, hour_id):

    conn = get_db_connection()
    cur = conn.cursor()

    query = 'SELECT * FROM public.patient WHERE fk_user = %s'

    cur.execute(query, (patient_id,))

    result = cur.fetchone()

    if result[1]:
        return False
    
    cur.execute('INSERT INTO public.appointments( '
	'fk_psycho, fk_patient, appoint_date, fk_hour, appoint_status) '
	'VALUES (%s, %s, %s, %s, %s);',(id_psycho, patient_id, date, hour_id, True,))

    cur.execute('UPDATE public.patient '
	'SET fk_psycho=%s '
	'WHERE fk_user=%s;' , (id_psycho, patient_id,))

    conn.commit()

    query = 'SELECT * FROM public.patients_info WHERE fk_user = %s'

    cur.execute(query, (patient_id))

    result = cur.fetchone()

    user = {
        'user_id' : result[0],
        'name' : result[1],
        'last_name' : result[2],
        'email' : result[3],
        'type' : result[5],
        'psycho' : result[4]
    }

    cur.close()
    conn.close()

    return user