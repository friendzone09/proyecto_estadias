from app.models.db import get_db_connection

def get_schedule(psycho_id, date):

    conn = get_db_connection()
    cur = conn.cursor()

    conn = get_db_connection()
    cur = conn.cursor()

    day_week = date.weekday() + 1

    cur.execute('SELECT * FROM  public.laboral_days WHERE fk_psycho = %s AND fk_day = %s', (psycho_id, day_week,))

    result = cur.fetchone()

    if not result:
        return False

    if result[2] == False:
        return []
    
    query = '''
        SELECT id_hour, hour
        FROM schedule s
        JOIN hour h ON s.fk_hour = h.id_hour
        WHERE s.fk_psycho = %s
        AND s.fk_day = %s
        AND s.hour_status = true
        ORDER BY h.hour;
    '''

    cur.execute(query, (psycho_id, day_week,))
    result = cur.fetchall()

    cur.close()
    conn.close()

    return result