from app.models.db import get_db_connection

def cancel_appoint(id_psycho, date, hour_id):
    
    conn = get_db_connection()
    cur = conn.cursor()
    #Obtenemos los datos de la cita que deseamos cancelar
    cur.execute('SELECT * FROM public.appointments WHERE appoint_date = %s AND fk_psycho = %s AND fk_hour = %s' , (date, id_psycho, hour_id,))
    result = cur.fetchone()
    #Si la cita existe simplemente actualizamos el estado a False
    if result:

        cur.execute('UPDATE public.appointments '
	        'SET appoint_status=%s '
	        'WHERE id_appoint=%s', (False, result[0],))
        
        conn.commit()
        conn.close()
        cur.close()
        
        return {'message': 'Hora cancelada correctamente',
                'type' : 'success'}
    #Si no hacemos el insert de la cita pero con el estado en False
    cur.execute('INSERT INTO public.appointments( '
        'fk_psycho, appoint_date, fk_hour, appoint_status) '
        'VALUES (%s, %s, %s, %s);',(id_psycho, date, hour_id, False,))

    conn.commit()
    conn.close()
    cur.close()
    #Regresamos un mensaje de éxito
    return {'message': 'Hora cancelada correctamente',
            'type' : 'success'}
