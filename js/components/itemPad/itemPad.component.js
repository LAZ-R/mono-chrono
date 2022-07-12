import * as UTILS from '../../services/utils.service.js';

export const render = (itemType, item, route) => {
    switch (itemType) {
        case 'type':
            let total_distance = item.total_distance >= 1000 ?
            UTILS.roundTo((item.total_distance)/1000, 2) + ' km'
            : item.total_distance + ' m';

            let lap_length = item.lap_length >= 1000 ?
            UTILS.roundTo((item.lap_length)/1000, 2) + ' km'
            : item.lap_length + ' m';

            const itemPadType = document.createElement('a');
            itemPadType.setAttribute('class', 'item-pad');
            itemPadType.setAttribute('href', route);
            itemPadType.innerHTML = 
                '<span class="item-pad-title glowing-text-dark type-title">' + total_distance + '</span>' +
                '<span class="item-pad-title glowing-text-dark type-title">' + parseInt(item.total_distance) / parseInt(item.lap_length) + ' x ' + lap_length + '</span>';

            return itemPadType;
        case 'session':
            let total_time = UTILS.secondsToFormatedTimeString(item.total_time);
            let average_time = UTILS.secondsToFormatedTimeString(item.average_time);
            let best_time = UTILS.secondsToFormatedTimeString(item.best_time);

            const itemPadSession = document.createElement('a');
            itemPadSession.setAttribute('class', 'item-pad');
            itemPadSession.setAttribute('href', route);
            itemPadSession.innerHTML = 
            '<span class="item-pad-title type-title"><span class="glowing-text-dark">SESSION ' + item.id + '</span></span>' +
            '<span class="item-pad-title session-title"><span>Total : </span><span>' + total_time + '</span></span>' +
                '<span class="item-pad-title session-title"><span>Moyen : </span><span>' + average_time + '</span></span>' +
                '<span class="item-pad-title session-title"><span>Meilleur : </span><span>' + best_time + '</span></span>';

            return itemPadSession;
    
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