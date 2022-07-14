import * as UTILS from '../../services/utils.service.js';

export const render = (itemType, item, route) => {
    switch (itemType) {
        case 'type':
            let total_distance = UTILS.getStringFromDistance(item.total_distance);
            let lap_length;
            UTILS.isSprint(item) ? lap_length = 'Sprint' : lap_length = UTILS.getStringFromDistance(item.lap_length);

            const itemPadType = document.createElement('a');
            itemPadType.setAttribute('class', 'item-pad');
            itemPadType.setAttribute('href', route);
            UTILS.isSprint(item) ?
            itemPadType.innerHTML = 
                '<span class="item-pad-title glowing-text-dark">' + total_distance + '</span>' +
                '<span class="item-pad-title">' + lap_length + '</span>'
            : itemPadType.innerHTML = 
                '<span class="item-pad-title glowing-text-dark">' + total_distance + '</span>' +
                '<span class="item-pad-title">' + Math.ceil(parseInt(item.total_distance) / parseInt(item.lap_length)) + ' x ' + lap_length + '</span>';

            return itemPadType;

        case 'session':
            let total_time = UTILS.secondsToFormatedTimeString(item.total_time);
            let average_time = UTILS.secondsToFormatedTimeString(item.average_time);
            let best_time = UTILS.secondsToFormatedTimeString(item.best_time);

            const itemPadSession = document.createElement('a');
            itemPadSession.setAttribute('class', 'item-pad');
            itemPadSession.setAttribute('href', route);
            itemPadSession.innerHTML = 
            '<span class="item-pad-title"><span class="glowing-text-dark">SESSION ' + item.id + '</span></span>' +
            '<span class="item-pad-title session-title"><span>Total : </span><span>' + total_time + '</span></span>' +
                '<span class="item-pad-title session-title"><span>Moyen : </span><span>' + average_time + '</span></span>' +
                '<span class="item-pad-title session-title"><span>Meilleur : </span><span>' + best_time + '</span></span>';

            return itemPadSession;

        case 'sessionSprint':
            let total_time_sprint = UTILS.secondsToFormatedTimeString(item.total_time);

            const itemPadSessionSprint = document.createElement('a');
            itemPadSessionSprint.setAttribute('class', 'item-pad');
            itemPadSessionSprint.setAttribute('href', route);
            itemPadSessionSprint.innerHTML = 
            '<span class="item-pad-title"><span class="glowing-text-dark">SESSION ' + item.id + '<br>' + total_time_sprint + '</span></span>';

            return itemPadSessionSprint;

        case 'blank':
            const itemPadBlank = document.createElement('a');
            itemPadBlank.setAttribute('class', 'item-pad');
            itemPadBlank.setAttribute('href', route);
            itemPadBlank.innerHTML = 
            '<span class="item-pad-title session-title"><span></span><span>AJOUTER</span><span></span></span>' +
            '<span class="item-pad-title"><span class="glowing-text-dark">+</span></span>';

            return itemPadBlank;
    
        default:
            const itemPad = document.createElement('a');
            itemPad.setAttribute('class', 'item-pad');
            itemPad.setAttribute('href', route);
            itemPad.innerHTML = 
                '<span class="item-pad-total-distance">' + item.id + '</span>';
            return itemPad;
            break;
    }
    
}