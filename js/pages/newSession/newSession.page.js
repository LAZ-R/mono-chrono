import * as SERVICE_PWA from '../../services/pwa.service.js';
import * as SERVICE_STORAGE from '../../services/storage.service.js';
import * as UTILS from '../../services/utils.service.js';
import * as COMPONENT_HEADER from "../../components/header/header.component.js";

const sessionsList = SERVICE_STORAGE.getSessions();
const pageTitle = 'Nouvelle session';

const renderView = () => {

    const typeId = new URLSearchParams(window.location.search).get('type');
    const sessionTypeId = new URLSearchParams(window.location.search).get('sessionType');

    SERVICE_PWA.setHTMLTitle(pageTitle);

    if (typeId == null && sessionTypeId == null) {
        const page = document.createElement('div');
        page.setAttribute('id', 'page');
        page.setAttribute('class', 'page');
    
        const form = document.createElement('form');
        form.innerHTML = 
            '<span class="form-title">' + pageTitle + '</span>' +
            '<div class="form-row" id="typeSelectorRow">' +
                '<label for="sessionType"><b>Type de session</b></label>' +
            '</div>' +
            '<div class="form-submit-row">' +
                '<input type="submit" value="CRÉER !" class="vh-50-button">' +
            '</div>';
    
        page.appendChild(form);
        
        document.getElementById('main').appendChild(page);
    
        const select = document.createElement('select');
        select.setAttribute('id', 'sessionType');
        select.setAttribute('name', 'sessionType');
    
        document.getElementById('typeSelectorRow').appendChild(select);
    
        const types = SERVICE_STORAGE.getTypes();
    
        types.forEach(type => {
            const option = document.createElement('option');
            let total_distance = UTILS.getStringFromDistance(type.total_distance);
            let lap_length;
            if (UTILS.isSprint(type)) {
                lap_length = 'Sprint';
                option.innerHTML = total_distance + ' | ' + lap_length;
            } else {
                lap_length = UTILS.getStringFromDistance(type.lap_length);
                option.innerHTML = total_distance + ' | ' + Math.ceil(parseInt(type.total_distance) / parseInt(type.lap_length)) + ' x ' + lap_length;
            }
            option.setAttribute('id', 'typeOption' + type.id);
            option.setAttribute('name', 'sessionType');
            option.value = type.id;
            
            select.appendChild(option);
        });



    } else {
        const newID = SERVICE_STORAGE.getSessionsLatestId() +1;
        let finalTypeID = 0;
        if (typeId != null && sessionTypeId == null) {
            finalTypeID = typeId;
        } else if (typeId == null && sessionTypeId != null) {
            finalTypeID = sessionTypeId;
        }
        const newSession = {
            id: newID,
            type: finalTypeID,
            date: new Date(Date.now()).toLocaleDateString(),
            laps:[],
            total_time: null,
            average_time: null,
            average_speed: null,
            best_time: null,
            best_speed: null
        };

        SERVICE_STORAGE.addSession(newSession);
        window.location = './session.html?id=' + newID;
    }
}

COMPONENT_HEADER.render('index');
renderView();