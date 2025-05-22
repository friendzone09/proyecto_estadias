from app.db import get_db_connection

def cancel_appoint(id_psycho, date, hour_id):
    
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('SELECT * FROM public.appointments WHERE appoint_date = %s AND fk_psycho = %s AND fk_hour = %s' , (date, id_psycho, hour_id,))
    result = cur.fetchone()

    if result:

        cur.execute('UPDATE public.appointments '
	        'SET appoint_status=%s '
	        'WHERE id_appoint=%s', (False, result[0],))
        
        conn.commit()
        conn.close()
        cur.close()
        
        return {'message': 'Cambio exitoso'}

    cur.execute('INSERT INTO public.appointments( '
        'fk_psycho, appoint_date, fk_hour, appoint_status) '
        'VALUES (%s, %s, %s, %s);',(id_psycho, date, hour_id, False,))

    conn.commit()
    conn.close()
    cur.close()

    return {'message': 'Cambio exitoso'}
