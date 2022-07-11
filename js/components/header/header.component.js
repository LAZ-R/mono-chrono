export const render = (option) => {
    const indexLi =
    '<li class="header-nav-item">' +
        '<a href="./index.html">Accueil</a>' +
    '</li>';
    const header = document.createElement('header');

    let ul = '';

    switch (option) {
        case 'index':
            ul = 
                '<ul class="header-nav-ul">' +
                indexLi +
                    '</ul>';
            break;
        case 'void':
            ul = 
                '<ul class="header-nav-ul">' +
                '</ul>';
        break;
        default:
            ul = 
                '<ul class="header-nav-ul">' +
                    indexLi +
                '</ul>';
            break;
    }

    header.innerHTML =
                '<span class="header-logo" alt="app logo">MONO CHRONO</span>' +
                '<nav class="header-nav">' +
                    ul +
                '</nav>';
    

    document.getElementById('body').insertBefore(header, document.getElementById('main'));
}