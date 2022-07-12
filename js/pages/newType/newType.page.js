import * as SERVICE_PWA from '../../services/pwa.service.js';
import * as SERVICE_STORAGE from '../../services/storage.service.js';
import * as UTILS from '../../services/utils.service.js';
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
    
    document.getElementById('main').appendChild(page);
}

COMPONENT_HEADER.render('index');
renderView();