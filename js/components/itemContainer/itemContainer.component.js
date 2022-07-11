export const render = (item) => {
    const itemContainer = document.createElement('div');
    itemContainer.setAttribute('class', 'item-container');

    itemContainer.innerHTML = 
        '<div class="item-details-image" style="background-image: url(' + item.image + ');"></div>' +
        '<div class="item-details">' +
            '<span class="item-price">$' + item.price + '</span>' +
            '<div class="detail">Description : ' +
                '<p class="detail-text">' + item.desc + '</p>' +
            '</div>' +
            '<button class="primary-button">Add to cart</button>' +
        '</div>';

    return itemContainer;
}