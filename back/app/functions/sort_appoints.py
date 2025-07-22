def sort_appoints(schedule, appoints):
    new_schedule = []
    appoint_map = {a['hour']: a for a in appoints}

    for sch in schedule:
        match = appoint_map.get(sch['id'])

        if match:
            new_schedule.append({
                'id': sch['id'],
                'hour': sch['hour'],
                'status': match['status'],
                'name': match['name'],
                'last_name': match['last_name']
            })
        else:
            new_schedule.append({
                'id': sch['id'],
                'hour': sch['hour'],
                'status': None
            })

    return new_schedule