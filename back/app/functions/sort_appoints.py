def sort_appoints(schedule, appoints):

    new_schedule = []

    if not appoints:
        for i in schedule:
            new_schedule.append({ 'id' : i['id'] , 'hour' : i['hour'], 'status' : None})

        return new_schedule
    
    appoint_dict = {j['hour']: j['status'] for j in appoints}

    for i in schedule:
        status = appoint_dict.get(i['id'], None)
        new_schedule.append({'id': i['id'], 'hour': i['hour'], 'status': status})

    return new_schedule