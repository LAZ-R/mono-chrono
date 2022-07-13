import * as SERVICE_STORAGE from './storage.service.js'

export const roundTo = (n, digits) => {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.floor(n) / multiplicator).toFixed(digits);
    if (negative) {
        n = (n * -1).toFixed(digits);
    }
    return n;
}

export const secondsToFormatedTimeString = (time) => {
    let time_hours = Math.floor(time / 3600);
    time = time - time_hours * 3600

    let time_minutes = Math.floor(time / 60);
    time = time - time_minutes * 60

    let time_seconds = roundTo(time, 2);
    
    if (time_hours.toString().length == 1) {
        time_hours = '0' + time_hours;
    }
    if (time_minutes.toString().length == 1) {
        time_minutes = '0' + time_minutes;
    }
    if (time_seconds.toString().length == 4) {
        time_seconds = '0' + time_seconds;
    }

    let final_time = '' + time_hours + ':'+ time_minutes + ':' + time_seconds + '';

    return final_time
}

export const calculateSessionStats = (session) => {
    let type = SERVICE_STORAGE.getTypeById(session.type);

    let total_time = 0;
    let average_time = 0;
    let average_speed = 0;
    let best_time = 0;
    let best_speed = null;

    session.laps.forEach(lap => {
        total_time += lap.time;
        if (best_time == 0) {
            best_time = lap.time;
        } else {
            if (lap.time < best_time) {
                best_time = lap.time;
            }
        }
    });

    average_time = total_time / session.laps.length;
    average_speed = (type.lap_length / 1000) / (average_time / 3600);
    best_speed = (type.lap_length / 1000) / (best_time / 3600);

    session.total_time = roundTo(total_time, 2);
    session.average_time = roundTo(average_time, 2);
    session.average_speed = roundTo(average_speed, 2);
    session.best_time = roundTo(best_time, 2);
    session.best_speed = roundTo(best_speed, 2);

    return session;
}

export const getStringFromDistance = (distance) => {
    return distance >= 1000 ?
    roundTo((distance)/1000, 3) + ' km'
    : distance + ' m';
}

export const isSprint = (type) => type.lap_length == type.total_distance ;