import * as SERVICE_PWA from '../../services/pwa.service.js';
import * as SERVICE_STORAGE from '../../services/storage.service.js';
import * as COMPONENT_HEADER from "../../components/header/header.component.js";

const sessionsList = SERVICE_STORAGE.getSessions();
const pageTitle = 'Sessions';

const renderView = () => {

    SERVICE_PWA.setHTMLTitle(pageTitle);

    const page = document.createElement('div');
    page.setAttribute('id', 'page');
    page.setAttribute('class', 'page');
    page.appendChild(document.createElement('h1')).innerHTML =
        pageTitle;

    sessionsList.forEach(session => {
        let total_distance = SERVICE_STORAGE.getTypeById(session.type).total_distance >= 1000 ?
            roundTo((SERVICE_STORAGE.getTypeById(session.type).total_distance)/1000, 2) + ' km'
            : SERVICE_STORAGE.getTypeById(session.type).total_distance + ' m';
        let total_time = secondsToFormatedTimeString(session.total_time);
        let average_time = secondsToFormatedTimeString(session.average_time);
        let best_time = secondsToFormatedTimeString(session.best_time);
            
            page.appendChild(document.createElement('div')).innerHTML =
        '<div class="top-tab-session">' +
            '<span class="top-tab-row-session"><span>Session</span><span>n°' + session.id + '</span></span>' +
            '<span class="top-tab-row-session"><span><b>Type</b></span><span></span></span>' +
            '<span class="top-tab-row-session"><span>Distance totale</span><span>' + total_distance + '</span></span>' +
            '<span class="top-tab-row-session"><span>Longueur du tour</span><span>' + SERVICE_STORAGE.getTypeById(session.type).lap_length + ' m</span></span>' +
            '<span class="top-tab-row-session"><span>Nombre de tours</span><span>' + session.laps.length + '</span></span>' +
            '<span class="top-tab-row-session"><span><b>Session</b></span><span></span></span>' +
            '<span class="top-tab-row-session"><span>Temps total</span><span>' + total_time + '</span></span>' +
            '<span class="top-tab-row-session"><span>Temps moyen</span><span>' + average_time + '</span></span>' +
            '<span class="top-tab-row-session"><span>Vitesse moyenne</span><span>' + session.average_speed + ' km/h</span></span>' +
            '<span class="top-tab-row-session"><span>Meilleur temps</span><span>' + best_time + '</span></span>' +
            '<span class="top-tab-row-session"><span>Meilleur vitesse</span><span>' + session.best_speed + ' km/h</span></span>' +
        '</div>';
    });
    
    document.getElementById('main').appendChild(page);
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

const secondsToFormatedTimeString = (time) => {
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

COMPONENT_HEADER.render('index');
renderView();