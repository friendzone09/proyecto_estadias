def sort_appoints(schedule, appoints):

    new_schedule = []

    if not appoints:
        for i in schedule:
            new_schedule.append({ 'id' : i['id'] , 'hour' : i['hour'], 'status' : False})

        return new_schedule
    
    for i in schedule:

        for j in appoints:

            if i['id'] == j['hour']:
                new_schedule.append({ 'id' : i['id'] , 'hour' : i['hour'], 'status' : True})

            else:
                new_schedule.append({ 'id' : i['id'] , 'hour' : i['hour'], 'status' : False})

    return new_schedule