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