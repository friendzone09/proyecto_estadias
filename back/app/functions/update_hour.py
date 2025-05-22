def update_hour(cur, id_hour,id_psycho, id_day, status):

    cur.execute (''' 
        UPDATE public.schedule
        SET hour_status=%s
        WHERE fk_psycho=%s AND fk_day=%s AND fk_hour=%s;
    ''', (status,id_psycho, id_day, id_hour,))
