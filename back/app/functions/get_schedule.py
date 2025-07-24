from app.models.db import get_db_connection

#Está función devulve las horas que labora un psicólogo en un día

def get_schedule(psycho_id, date):

    conn = get_db_connection()
    cur = conn.cursor()

    conn = get_db_connection()
    cur = conn.cursor()

    day_week = date.weekday() + 1

    cur.execute('SELECT * FROM  public.laboral_days WHERE fk_psycho = %s AND fk_day = %s', (psycho_id, day_week,))

    result = cur.fetchone()

    #El psicólgo o el día no existe 
    if not result:
        return False

    #Si el día no es laborable, regresa un array vacio
    if result[2] == False:
        return []
    
    #Este JOIN regresa el id de la hora y la hora (Siempre y cuando el estado de la hora sea true, es decir, es una hora laborable)
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