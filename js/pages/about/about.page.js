import * as SERVICE_PWA from '../../services/pwa.service.js';
import * as COMPONENT_HEADER from "../../components/header/header.component.js";

const pageTitle = 'About';

const renderView = () => {

    SERVICE_PWA.setHTMLTitle(pageTitle);
    
    const page = document.createElement('div');
    page.setAttribute('id', 'page');
    page.setAttribute('class', 'page');
    page.appendChild(document.createElement('h1')).innerHTML =
        pageTitle;
    page.appendChild(document.createElement('p')).innerHTML =
        'Made by laz-R with ♥';
    
    document.getElementById('main').appendChild(page);
}

COMPONENT_HEADER.render('index');
renderView();
