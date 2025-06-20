def user_role(cur, id_user):
    cur.execute('SELECT user_role FROM public.users WHERE id_user = %s', (id_user,))
    return cur.fetchone()[0]