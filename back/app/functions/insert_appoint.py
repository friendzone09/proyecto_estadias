from app.db import get_db_connection
def insert_appoint(id_psycho, patient_id, date, hour_id):

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO public.appointments( '
	'fk_psycho, fk_patient, appoint_date, fk_hour) '
	'VALUES (%s, %s, %s, %s);',(id_psycho, patient_id, date, hour_id))

    cur.execute('UPDATE public.patient '
	'SET fk_psycho=%s '
	'WHERE id_patient=%s;' , (id_psycho, patient_id,))

    conn.commit()

    cur.close()
    conn.close()
