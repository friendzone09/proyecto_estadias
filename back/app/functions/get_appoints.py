from app.db import get_db_connection

def get_appoint(psycho_id, date):
    conn = get_db_connection()
    cur = conn.cursor()

    query= '''
            SELECT 
            a.fk_hour, 
            a.appoint_status, 
            a.appoint_date, 
            p.user_name AS patient_name, 
            p.user_last_name AS patient_last_name
            FROM public.appointments a
            LEFT JOIN users p ON a.fk_patient = p.id_user
            WHERE a.appoint_date = %s
            AND a.fk_psycho = %s
            ORDER BY a.id_appoint ASC;
        '''

    cur.execute(query, (date, psycho_id,))
    result = cur.fetchall()

    return result