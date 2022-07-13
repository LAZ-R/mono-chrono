import * as UTILS from './utils.service.js'

export const STORAGE = localStorage;

export const checkFirstTime = () => {
    let firstTime = STORAGE.getItem('monoChronoFirstTime');

    if (firstTime === null) {
        STORAGE.setItem('monoChronoFirstTime', '0');

        let userTmp = {
            types: [{
                id: 1,
                total_distance: 10000,
                lap_length: 400
            }],
            sessions: [{
                id: 1,
                type: 1,
                laps:[
                    {  id:  1, time: 75.95 },
                    {  id:  2, time: 75.65 },
                    {  id:  3, time: 74.78 },
                    {  id:  4, time: 72.39 },
                    {  id:  5, time: 74.67 },
                    {  id:  6, time: 73.29 },
                    {  id:  7, time: 70.42 },
                    {  id:  8, time: 75.95 },
                    {  id:  9, time: 72.30 },
                    {  id: 10, time: 72.43 },
                    {  id: 11, time: 72.26 },
                    {  id: 12, time: 72.16 },
                    {  id: 13, time: 70.66 },
                    {  id: 14, time: 72.50 },
                    {  id: 15, time: 70.86 },
                    {  id: 16, time: 70.60 },
                    {  id: 17, time: 70.99 },
                    {  id: 18, time: 70.30 },
                    {  id: 19, time: 72.38 },
                    {  id: 20, time: 71.00 },
                    {  id: 21, time: 71.19 },
                    {  id: 22, time: 71.49 },
                    {  id: 23, time: 69.19 },
                    {  id: 24, time: 67.85 },
                    {  id: 25, time: 67.14 }
                ],
                total_time: null,
                average_time: null,
                average_speed: null,
                best_time: null,
                best_speed: null
            }]
        };
        STORAGE.setItem('monoChronoUser', JSON.stringify(userTmp));
        let type2 = {
            id: 2,
            total_distance: 42195,
            lap_length: 42195
        }
        let session2 = {
            id: 2,
            type: 2,
            laps:[
                {  id:  1, time: 9144.89 }
            ],
            total_time: null,
            average_time: null,
            average_speed: null,
            best_time: null,
            best_speed: null
        };
        addType(type2);
        addSession(session2);
    }
}

export const getTypes = () => {
    const User = JSON.parse(STORAGE.getItem('monoChronoUser'));
    return User.types;
}

export const getTypeById = (typeId) => {
    let typeReturn = {};
    const User = JSON.parse(STORAGE.getItem('monoChronoUser'));

    User.types.forEach(type => {
        if (type.id == typeId) {
            typeReturn = type;
        }
    });

    return typeReturn;
}

export const getTypesLatestId = () => {
    let idReturn = 0;
    const User = JSON.parse(STORAGE.getItem('monoChronoUser'));

    User.types.forEach(type => {
        idReturn = type.id;
    });

    return idReturn;
}

export const addType = (typeToAdd) => {
    let User = JSON.parse(STORAGE.getItem('monoChronoUser'));
    let tmpArray = [];
    User.types.forEach(type => {
        tmpArray.push(type);
    });
    tmpArray.push(typeToAdd);
    console.log('tmp type array : ' + tmpArray);
    User.types = tmpArray;
    STORAGE.setItem('monoChronoUser', JSON.stringify(User));
}

export const getSessions = () => {
    let sessionsToReturn = [];
    const User = JSON.parse(STORAGE.getItem('monoChronoUser'));
    User.sessions.forEach(session => {

            let type = getTypeById(session.type);

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

            sessionsToReturn.push(session);
    });
    return sessionsToReturn;
}

export const getSessionByID = (sessionId) => {
    const User = JSON.parse(STORAGE.getItem('monoChronoUser'));
    let sessionToReturn;
    User.sessions.forEach(session => {
        if (session.id == sessionId) {
            if (session.total_time == null) {

                sessionToReturn =  UTILS.calculateSessionStats(session)
                
            }
        }
    });
    return sessionToReturn;
}

export const getSessionsByType = (typeId) => {
    const allSessions = getSessions();
    const sessionsToReturn = [];

    allSessions.forEach(session => {
        if (session.type == typeId) {
            sessionsToReturn.push(session);        }
    });

    return sessionsToReturn;
}

export const addSession = (sessionToAdd) => {
    let User = JSON.parse(STORAGE.getItem('monoChronoUser'));
    let tmpArray = [];
    User.sessions.forEach(session => {
        tmpArray.push(session);
    });
    tmpArray.push(sessionToAdd);
    User.sessions = tmpArray;
    STORAGE.setItem('monoChronoUser', JSON.stringify(User));
}

const roundTo = (n, digits) => {
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