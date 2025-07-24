#Esta función combina el horario del psicólogo junto con las citas agendadas ese dia

def sort_appoints(schedule, appoints):
    new_schedule = []
    #Se crea un objeto de objetos, la id es la hora de la cita agendada
    appoint_map = {a['hour']: a for a in appoints}

    for sch in schedule:
        match = appoint_map.get(sch['id'])
        #Si la hora de una cita coincide con una hora en el horario del psicólogo, se agrega este objeto a new_schedule
        if match:
            new_schedule.append({
                'id': sch['id'],
                'hour': sch['hour'],
                'status': match['status'],
                'name': match['name'],
                'last_name': match['last_name']
            })
        #De lo contrario, este, con menos propiedades
        else:
            new_schedule.append({
                'id': sch['id'],
                'hour': sch['hour'],
                'status': None
            })

    return new_schedule