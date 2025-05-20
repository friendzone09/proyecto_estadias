from app.db import get_db_connection

def get_appoint(psycho_id, date):
    conn = get_db_connection()
    cur = conn.cursor()

    query= 'SELECT * FROM public.appointments WHERE appoint_date = %s AND fk_psycho = %s'

    cur.execute(query, (date, psycho_id,))
    result = cur.fetchall()

    return result