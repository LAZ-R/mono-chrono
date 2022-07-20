import * as SERVICE_PWA from '../../services/pwa.service.js';
import * as SERVICE_STORAGE from '../../services/storage.service.js';
import * as UTILS from '../../services/utils.service.js';
import * as COMPONENT_HEADER from "../../components/header/header.component.js";

const threeLapsToGoSound = new Audio('./audio/3lapsToGo.mp3');
const endSound = new Audio('./audio/end.mp3');

let SESSION = SERVICE_STORAGE.getSessionByID(new URLSearchParams(window.location.search).get('id'));
const TYPE = SERVICE_STORAGE.getTypeById(SESSION.type);
const IS_SPRINT = UTILS.isSprint(TYPE);

const total_laps = Math.ceil(parseInt(TYPE.total_distance) / parseInt(TYPE.lap_length));
let current_lap = 0;
let totalTime = 0;
let downIn = 100;
let displayTime = '00:00:00.00';

const funcDisplayTotalTime = () => {
    const span = document.getElementById('totalTimeSpan');
    span.innerHTML = '';
    span.innerHTML = displayTime;
}

const incrementTotalTime = () => {
    totalTime += 1;
    downIn -= 1;
    if (downIn == 0) {
        totalTime -=3;
        downIn = 100;
    }
    let tmpDisplayTime = totalTime / 100;
    displayTime = UTILS.secondsToFormatedTimeString(tmpDisplayTime);
    funcDisplayTotalTime();
    setTimeout(() => {
        incrementTotalTime();
    }, 9);
}

const createLap = () => {
    
    
    const lapTime = UTILS.roundTo(totalTime / 100, 2);
    totalTime = 0;

    const lap = {
        id: current_lap,
        time : parseFloat(lapTime)
    };
    
    SESSION.laps.push(lap);
    SERVICE_STORAGE.updateSession(SESSION);


    if (current_lap == total_laps) {
        endSound.play();
        document.getElementById('page').innerHTML = '';
        setTimeout(() => {
            window.location = './previousSessions.html?session=' + session.id;            
        }, 2000);
    } else {
        current_lap += 1;

        if (total_laps > 5 && current_lap == total_laps - 2) {
            threeLapsToGoSound.play();
        } else {
            let lapSound = new Audio('./audio/lap.mp3');
            lapSound.play();
        }

        SESSION = SERVICE_STORAGE.getSessionByID(new URLSearchParams(window.location.search).get('id'));
    
        updateLapsDisplay();
        const button = document.getElementById('lapButton');
        button.innerHTML = current_lap == total_laps ? 'DERNIER<br>TOUR' : '<span class="glowing-text-bright">TOUR ' + current_lap + '</span>' ;
    }
}

const updateLapsDisplay = () => {
    const topTab = document.getElementById('topTab');
    topTab.innerHTML = '';
    const laps = SESSION.laps;
    laps.slice().reverse().forEach(lap => {
        const span = document.createElement('span');
        span.setAttribute('class', 'array-row');
        span.innerHTML =
        '<b>Tour ' + lap.id + '</b><span>' + UTILS.secondsToFormatedTimeString(lap.time) + '<span>';
        topTab.appendChild(span);
    });
}

const renderView = () => {
    let pageTitle = '';

    let total_distance = UTILS.getStringFromDistance(TYPE.total_distance);
    let lap_length;
    if (IS_SPRINT) {
        lap_length = 'Sprint';
        pageTitle = total_distance + ' | ' + lap_length;
    } else {
        lap_length = UTILS.getStringFromDistance(TYPE.lap_length);
        pageTitle = total_distance + ' | ' + Math.ceil(parseInt(TYPE.total_distance) / parseInt(TYPE.lap_length)) + ' x ' + lap_length;
    }
    
    SERVICE_PWA.setHTMLTitle(pageTitle);
    
    const page = document.createElement('div');
    page.setAttribute('id', 'page');
    page.setAttribute('class', 'page');

    const topTitleArea = document.createElement('div');
        topTitleArea.setAttribute('id', 'topTitleArea');
        topTitleArea.setAttribute('class', 'top-title-area');
        topTitleArea.innerHTML = pageTitle;
        page.appendChild(topTitleArea)

    const lapsContainer = document.createElement('div');
    lapsContainer.setAttribute('id', 'lapsContainer');
    lapsContainer.setAttribute('class', 'laps-container');
    lapsContainer.innerHTML =
        '<b>Tours précédents</b>' +
        '<div class="array" id="topTab"></div>';

    const lapsContainerShadow = document.createElement('div');
    lapsContainerShadow.setAttribute('id', 'lapsContainerShadow');
    lapsContainerShadow.setAttribute('class', 'laps-container-shadow');

    lapsContainer.appendChild(lapsContainerShadow);

    page.appendChild(lapsContainer);

    const totalTimeDiv = document.createElement('div');
    totalTimeDiv.setAttribute('id', 'totalTimeDiv');
    totalTimeDiv.setAttribute('class', 'time-div');

    const totalTimeSpan = document.createElement('span');
    totalTimeSpan.setAttribute('id', 'totalTimeSpan');
    totalTimeSpan.setAttribute('class', 'time-span');

    totalTimeDiv.appendChild(totalTimeSpan);

    page.appendChild(totalTimeDiv);

    const goButton = document.createElement('button');
    goButton.setAttribute('id', 'goButton');
    goButton.setAttribute('class', 'primary-button no-border-button lap-button');
    goButton.innerHTML =
        '<span class="glowing-text-bright">GO</span>';
    goButton.addEventListener('click', () => {
        current_lap = 1;
        incrementTotalTime();
        goButton.remove();

        const lapButton = document.createElement('button');
        lapButton.setAttribute('id', 'lapButton');
        lapButton.setAttribute('class', 'primary-button no-border-button lap-button');
        IS_SPRINT ? lapButton.innerHTML = '<span class="glowing-text-bright">FIN</span>' : lapButton.innerHTML = '<span class="glowing-text-bright">TOUR ' + current_lap + '</span>';
        lapButton.addEventListener('click', () => {
            createLap();
        });

        page.appendChild(lapButton);
    });

    page.appendChild(goButton);
    
    document.getElementById('main').appendChild(page);

    funcDisplayTotalTime();
};

const globalSessionId = new URLSearchParams(window.location.search).get('id');
const session = SERVICE_STORAGE.getSessionByID(globalSessionId);

if (session.laps.length != 0) {
    window.location = './previousSessions.html?session=' + session.id;
} else {
    // Keep screen on

    // initialization : wake lock sentinel
    let wakeLock = null;

    if ('wakeLock' in navigator) {
        console.log("// Screen Wake Lock API supported 🎉");
    }

    /**
     * Request the screen to stay awake
     */
    const requestWakeLock = async () => {
        console.log('wakeLock requested');
        try {
            // initialization : wake lock sentinel
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                console.log('Screen Wake Lock released:', wakeLock.released);
            });
            console.log('Screen Wake Lock released:', wakeLock.released);
        } catch (err) {
            console.error(err);
        }
    };

    document.addEventListener('visibilitychange', async () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
        }
    });

    requestWakeLock()
    .then(COMPONENT_HEADER.render('index'))
    .then(renderView());
}