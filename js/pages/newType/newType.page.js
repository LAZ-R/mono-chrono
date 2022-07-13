import * as SERVICE_PWA from '../../services/pwa.service.js';
import * as SERVICE_STORAGE from '../../services/storage.service.js';
import * as UTILS from '../../services/utils.service.js';
import * as COMPONENT_HEADER from "../../components/header/header.component.js";

const sessionsList = SERVICE_STORAGE.getSessions();
const pageTitle = 'Nouveau type';

const renderView = () => {

    const totalDistance = new URLSearchParams(window.location.search).get('totalDistance');
    let lapLength = new URLSearchParams(window.location.search).get('lapLength');

    if (totalDistance != null && lapLength != null) {
        lapLength == undefined ? console.log('is undefined') : console.log('is not undefined');
        if (lapLength == "" ) lapLength = totalDistance
        const nextId = SERVICE_STORAGE.getTypesLatestId() + 1;
        const typeToAdd = {
            id: nextId,
            total_distance: totalDistance,
            lap_length: lapLength
        };
        SERVICE_STORAGE.addType(typeToAdd)
        window.location = './previousSessions.html?type=' + nextId;
    }

    SERVICE_PWA.setHTMLTitle(pageTitle);

    const page = document.createElement('div');
    page.setAttribute('id', 'page');
    page.setAttribute('class', 'page');
    page.appendChild(document.createElement('h1')).innerHTML =
        pageTitle;
    
    const form = 
    '<form>' +
        '<div class="form-row">' +
            '<label for="totalDistance"><b>Distance totale</b><br>en mètres</label>' +
            '<input type="number" name="totalDistance" id="totalDistanceInput" required>' +
        '</div>' +
        '<div class="form-row">' +
            '<label for="lapLength"><b>Longueur du tour</b><br>en mètres<br><i>(laisser vide pour sprint)</i></label>' +
            '<input type="number" name="lapLength" id="lapLengthInput" >' +
        '</div>' +
        '<div class="form-submit-row">' +
            '<input type="submit" value="Valider !">' +
        '</div>' +
    '</form>';

    page.appendChild(document.createElement('div')).innerHTML =
        form;
    
    document.getElementById('main').appendChild(page);
}

COMPONENT_HEADER.render('index');
renderView();