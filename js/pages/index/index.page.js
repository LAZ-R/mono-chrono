import * as COMPONENT_FOOTER from '../../components/footer/footer.component.js'
import * as SERVICE_PWA from '../../services/pwa.service.js';
import * as SERVICE_STORAGE from '../../services/storage.service.js';
import * as COMPONENT_HEADER from "../../components/header/header.component.js";

const pageTitle = 'Mono Chrono';

const renderView = () => {

    SERVICE_PWA.setHTMLTitle(pageTitle);
    
    const page = document.createElement('div');
    page.setAttribute('id', 'page');
    page.setAttribute('class', 'page');
    
    const topContent = document.createElement('div');
    topContent.setAttribute('id', 'topContent');
    topContent.setAttribute('class', 'top-content');

    const types = SERVICE_STORAGE.getTypes();
    const previousSessions = SERVICE_STORAGE.getSessions();
    topContent.innerHTML =
        '<div class="top-tab">' +
            '<span class="top-tab-row"><span>Types de session</span><span>' + types.length + '</span></span>' +
            '<span class="top-tab-row"><span>Sessions précédentes</span><span>' + previousSessions.length + '</span></span>' +
        '</div>'

    const previousSessionsButton = document.createElement('button');
    previousSessionsButton.setAttribute('id', 'previousSessionsButton');
    previousSessionsButton.setAttribute('class', '');
    previousSessionsButton.innerHTML = 'Sessions précedentes';
    previousSessionsButton.addEventListener('click', () => {
        window.open('./previousSessions.html', '_self');
    });

    topContent.appendChild(previousSessionsButton);

    page.appendChild(topContent);

    const newType = document.createElement('button');
    newType.setAttribute('id', 'newType');
    newType.setAttribute('class', 'no-border-button new-type-button');
    newType.innerHTML =
        '<p class="special-animated">' +
            '<span class="glowing-text-dark">' +
                'Nouveau<br>type' +
            '</span>' +
        '</p>';
    newType.addEventListener('click', () => {
        window.open('./newType.html', '_self');
    });
    page.appendChild(newType);

    const newSession = document.createElement('button');
    newSession.setAttribute('id', 'newSession');
    newSession.setAttribute('class', 'no-border-button new-session-button');
    newSession.innerHTML =
    '<p class="special-animated">' +
        '<span class="glowing-text-bright">' +
            'Nouvelle<br>Session' +
        '</span>' +
    '</p>';
    
    page.appendChild(newSession);
    
    document.getElementById('main').appendChild(page);
}

SERVICE_STORAGE.checkFirstTime();
COMPONENT_HEADER.render('void');
renderView();
COMPONENT_FOOTER.render();