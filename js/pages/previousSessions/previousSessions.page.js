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

        const topTitleArea = document.createElement('div');
        topTitleArea.setAttribute('id', 'topTitleArea');
        topTitleArea.setAttribute('class', 'top-title-area');
        topTitleArea.innerHTML = pageTitle;
        page.appendChild(topTitleArea)

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
        const topTitleArea = document.createElement('div');
        topTitleArea.setAttribute('id', 'topTitleArea');
        topTitleArea.setAttribute('class', 'top-title-area');
        topTitleArea.innerHTML = pageTitle;
        page.appendChild(topTitleArea)

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
        const session = SERVICE_STORAGE.getSessionByID(sessionId);
        const TYPE = SERVICE_STORAGE.getTypeById(session.type);

        pageTitle = session.date;
        SERVICE_PWA.setHTMLTitle(pageTitle);
        
        const topTitleArea = document.createElement('div');
        topTitleArea.setAttribute('id', 'topTitleArea');
        topTitleArea.setAttribute('class', 'top-title-area');
        topTitleArea.innerHTML = pageTitle;
        page.appendChild(topTitleArea)

        let total_distance = UTILS.getStringFromDistance(TYPE.total_distance);
        let lap_length;
        let total_time = UTILS.secondsToFormatedTimeString(session.total_time);
        let average_time = UTILS.secondsToFormatedTimeString(session.average_time);
        let best_time = UTILS.secondsToFormatedTimeString(session.best_time);

        const IS_SPRINT = UTILS.isSprint(TYPE);


        const bottomArea = document.createElement('div');
            bottomArea.setAttribute('id', 'bottomArea');
            bottomArea.setAttribute('class', 'bottom-area');

        if (IS_SPRINT) {
            lap_length = 'Sprint';
            bottomArea.innerHTML =
            '<div class="type-area">' +
                '<span>' + total_distance + ' | ' + lap_length + '</span>' +
            '</div>' +
            '<div class="total-time-area">' +
                    '<span>' + total_time + '</span>' +
            '</div>' +
            '<div class="all-speed-area">' +
                '<div class="speed-area average-color">' +
                    '<img src="./images/gauge-simple.svg" alt="Compteur de vitesse avec l\'aiguille au centre" class="stats-icon">' +
                    '<span>' + session.average_speed + ' km/h</span>' +
                '</div>' +
            '</div>';
            page.appendChild(bottomArea);
        } else {
            lap_length = UTILS.getStringFromDistance(TYPE.lap_length);
            bottomArea.innerHTML =
            '<div class="type-area">' +
                '<span>' + total_distance + ' | ' + Math.ceil(parseInt(TYPE.total_distance) / parseInt(TYPE.lap_length)) + ' x ' + lap_length + '</span>' +
            '</div>' +
            '<div class="total-time-area">' +
                    '<span>' + total_time + '</span>' +
            '</div>' +
            '<div class="times-area">' +
                '<div class="time-area average-color">' +
                    '<span>Tour moyen</span>' +
                    '<span>' + average_time + '</span>' +
                '</div>' +
                '<div class="time-area best-color">' +
                    '<span>Meilleur Tour</span>' +
                    '<span>' + best_time + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="all-speed-area">' +
                '<div class="speed-area average-color">' +
                    '<img src="./images/gauge-simple.svg" alt="Compteur de vitesse avec l\'aiguille au centre" class="stats-icon">' +
                    '<span>' + session.average_speed + ' km/h</span>' +
                '</div>' +
                '<div class="speed-area best-color">' +
                '<img src="./images/gauge-simple-high.svg" alt="Compteur de vitesse avec l\'aiguille à droite" class="stats-icon">' +
                    '<span>' + session.best_speed + ' km/h</span>' +
                '</div>' +
            '</div>';

            const lapsArea = document.createElement('div');
            lapsArea.setAttribute('class', 'laps-area');
            //lapsArea.innerHTML = '<b>Tours</b>'
            
            const lapsArray = document.createElement('div');
            lapsArray.setAttribute('class', 'array');

            for (let index = 0; index < session.laps.length; index++) {
                const lap = session.laps[index];

                let differenceSpan = '';
                if (index == 0) {
                    differenceSpan = '<span class="session-special-span"></span>';
                } else {
                    const previousTime = session.laps[index - 1].time;
                    if (lap.time + 0.3 < previousTime) {
                        differenceSpan = '<span class="session-special-span better-lap">▼</span>';
                    } else if (lap.time - 0.3 > previousTime) {
                        differenceSpan = '<span class="session-special-span worst-lap">▲</span>';
                    } else {
                        differenceSpan = '<span class="session-special-span same-lap">═</span>';
                    }
                }
                const row = document.createElement('span');
                row.setAttribute('class', 'array-row session-special-row');
                row.innerHTML =
                    '<span class="session-special-span">Tour ' + lap.id + '</span>' + differenceSpan + '<span class="session-special-span">' + UTILS.secondsToFormatedTimeString(lap.time) + '</span>'

                lapsArray.appendChild(row);                
            }

            lapsArea.appendChild(lapsArray);

            bottomArea.appendChild(lapsArea);

            

            page.appendChild(bottomArea);

        }
    }
    
    
    
    
    document.getElementById('main').appendChild(page);
}

COMPONENT_HEADER.render('index');
renderView();
