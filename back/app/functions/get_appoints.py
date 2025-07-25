from app.models.db import get_db_connection

#Regresa todas las citas agendadas del dia esepcificado, obtniendo datos de la cita y del paciente que agendo esa cita.

def get_appoint(psycho_id, date):
    conn = get_db_connection()
    cur = conn.cursor()

    query= '''
            SELECT 
            a.fk_hour, 
            a.appoint_status, 
            a.appoint_date, 
            p.user_name AS patient_name, 
            p.user_last_name AS patient_last_name,
            pat.appoint_type AS appoint_type
            FROM public.appointments a
            LEFT JOIN users p ON a.fk_patient = p.id_user
            LEFT JOIN patient pat on a.fk_patient = pat.fk_user
            WHERE a.appoint_date = %s
            AND a.fk_psycho = %s
            ORDER BY a.id_appoint ASC;
        '''

    cur.execute(query, (date, psycho_id,))
    result = cur.fetchall()

    return result