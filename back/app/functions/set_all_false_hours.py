def set_false_hours(cur, id_day, id_psycho):

    cur.execute('''
        UPDATE public.laboral_days
        SET  laboral_day=%s
        WHERE fk_psycho=%s AND fk_day=%s;
    ''', (False, id_psycho, id_day,))

    cur.execute("SELECT public.deactivate_hours_day(%s, %s);", (id_psycho, id_day,))

    return {'message' : 'todo bien'}