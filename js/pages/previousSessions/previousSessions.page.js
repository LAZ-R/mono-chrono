import * as SERVICE_PWA from '../../services/pwa.service.js';
import * as SERVICE_STORAGE from '../../services/storage.service.js';
import * as UTILS from '../../services/utils.service.js';
import * as COMPONENT_HEADER from "../../components/header/header.component.js";
import * as COMPONENT_ITEM_PAD from "../../components/itemPad/itemPad.component.js";
import * as COMPONENT_ITEMS_GRID_CONTAINER from "../../components/itemsGridContainer/itemsGridContainer.component.js";


const renderView = () => {
    
    const typeId = new URLSearchParams(window.location.search).get('type');
    const sessionId = new URLSearchParams(window.location.search).get('session');

    let pageTitle = '';
    
    const page = document.createElement('div');
    page.setAttribute('id', 'page');
    page.setAttribute('class', 'page');
    

    if (typeId == null && sessionId == null) {
        pageTitle = 'Types';
        SERVICE_PWA.setHTMLTitle(pageTitle);
        page.appendChild(document.createElement('h1')).innerHTML =
            pageTitle;

        const itemsGridContainer = COMPONENT_ITEMS_GRID_CONTAINER.render();
        page.appendChild(itemsGridContainer);

        const types = SERVICE_STORAGE.getTypes();
        types.slice().reverse().forEach(type => {
            itemsGridContainer.appendChild(COMPONENT_ITEM_PAD.render('type', type, './previousSessions.html?type=' + type.id));
        });
        itemsGridContainer.appendChild(COMPONENT_ITEM_PAD.render('blank', null, './newType.html'));



    } else if (typeId != null && sessionId == null) {
        const type = SERVICE_STORAGE.getTypeById(typeId);
        let total_distance = UTILS.getStringFromDistance(type.total_distance);
        let lap_length;
        if (UTILS.isSprint(type)) {
            lap_length = 'Sprint';
            pageTitle = total_distance + ' | ' + lap_length;
        } else {
            lap_length = UTILS.getStringFromDistance(type.lap_length);
            pageTitle = total_distance + ' | ' + Math.ceil(parseInt(type.total_distance) / parseInt(type.lap_length)) + ' x ' + lap_length;
        }
        
        SERVICE_PWA.setHTMLTitle(pageTitle);
        page.appendChild(document.createElement('h1')).innerHTML =
            pageTitle;

        const itemsGridContainer = COMPONENT_ITEMS_GRID_CONTAINER.render();
        page.appendChild(itemsGridContainer);

        const sessions = SERVICE_STORAGE.getSessionsByType(typeId);
        sessions.slice().reverse().forEach(session => {
            if (UTILS.isSprint(type)) {
                itemsGridContainer.appendChild(COMPONENT_ITEM_PAD.render('sessionSprint', session, './previousSessions.html?session=' + session.id));
            } else {
                itemsGridContainer.appendChild(COMPONENT_ITEM_PAD.render('session', session, './previousSessions.html?session=' + session.id));
            }
        });
        itemsGridContainer.appendChild(COMPONENT_ITEM_PAD.render('blank', null, './newSession.html?type=' + typeId));



    } else if (typeId == null && sessionId != null) {
        pageTitle = 'Session ' + sessionId;
        SERVICE_PWA.setHTMLTitle(pageTitle);
        
        page.appendChild(document.createElement('h1')).innerHTML =
            pageTitle;

        const session = SERVICE_STORAGE.getSessionByID(sessionId);
        const TYPE = SERVICE_STORAGE.getTypeById(session.type);

        let total_distance = UTILS.getStringFromDistance(TYPE.total_distance);
        let total_time = UTILS.secondsToFormatedTimeString(session.total_time);
        let average_time = UTILS.secondsToFormatedTimeString(session.average_time);
        let best_time = UTILS.secondsToFormatedTimeString(session.best_time);

        const IS_SPRINT = UTILS.isSprint(TYPE);

        if (IS_SPRINT) {
            page.appendChild(document.createElement('div')).innerHTML =
            '<div class="top-tab-session">' +
                '<span class="top-tab-row-session"><span><b>Type</b></span><span></span></span>' +
                '<span class="top-tab-row-session"><span>Distance totale</span><span>' + total_distance + '</span></span>' +
                '<span class="top-tab-row-session"><span>Sprint</span><span></span></span>' +
                '<div class="top-tab-separator"></div>' +
                '<span class="top-tab-row-session"><span><b>Session</b></span><span></span></span>' +
                '<span class="top-tab-row-session"><span>Temps total</span><span>' + total_time + '</span></span>' +
                '<div class="top-tab-separator"></div>' +
                '<span class="top-tab-row-session"><span>Vitesse moyenne</span><span>' + session.average_speed + ' km/h</span></span>' +
            '</div>';
        } else {
            page.appendChild(document.createElement('div')).innerHTML =
            '<div class="top-tab-session">' +
                '<span class="top-tab-row-session"><span><b>Type</b></span><span></span></span>' +
                '<span class="top-tab-row-session"><span>Distance totale</span><span>' + total_distance + '</span></span>' +
                '<span class="top-tab-row-session"><span>Nombre de tours</span><span>' + session.laps.length + '</span></span>' +
                '<span class="top-tab-row-session"><span>Longueur du tour</span><span>' + TYPE.lap_length + ' m</span></span>' +
                '<div class="top-tab-separator"></div>' +
                '<span class="top-tab-row-session"><span><b>Session</b></span><span></span></span>' +
                '<span class="top-tab-row-session"><span>Temps total</span><span>' + total_time + '</span></span>' +
                '<span class="top-tab-row-session"><span>Temps moyen</span><span>' + average_time + '</span></span>' +
                '<span class="top-tab-row-session"><span>Meilleur temps</span><span>' + best_time + '</span></span>' +
                '<div class="top-tab-separator"></div>' +
                '<span class="top-tab-row-session"><span>Vitesse moyenne</span><span>' + session.average_speed + ' km/h</span></span>' +
                '<span class="top-tab-row-session"><span>Meilleur vitesse</span><span>' + session.best_speed + ' km/h</span></span>' +
            '</div>';
        page.appendChild(document.createElement('h1')).innerHTML =
            'Tours';
        const lapsArea = document.createElement('div');
        lapsArea.setAttribute('class', 'top-tab-session');

        session.laps.forEach(lap => {
            const row = document.createElement('span');
            row.setAttribute('class', 'top-tab-row-session');
            row.innerHTML =
                '<span>Tour ' + lap.id + '</span><span>' + UTILS.secondsToFormatedTimeString(lap.time) + '</span>'

            lapsArea.appendChild(row); 
        });

        page.appendChild(lapsArea);

        }
    }
    
    
    
    
    document.getElementById('main').appendChild(page);
}

COMPONENT_HEADER.render('index');
renderView();
