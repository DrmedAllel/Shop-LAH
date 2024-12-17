function addToCart(itemId, itemName, itemPrice, button) {
    const cartItem = {
        id: itemId,
        name: itemName,
        price: itemPrice
    };

    // Convert the cart item to a JSON string
    const cartItemString = JSON.stringify(cartItem);

    // Set the cookie with the cart item
    setCookie(itemId, cartItemString, 1);

    console.log(`Item added to cart: ${itemName} (${itemId}) - $${itemPrice}`);


    const language = getCookie('language');

    //Change the button text to remove from cart
    if (language === 'de') {
        button.innerHTML = 'Im Warenkorb';
    } else {
        button.innerHTML = 'In Cart';
    }
    
    //add the class remove-from-cart to the button
    button.classList.add('remove-from-cart');

    //get the cart_link element
    const cartLinks = document.getElementsByClassName('cart_link');

    for (let cartLink of cartLinks) {
        // Add a wiggle animation class
        cartLink.classList.add('wiggle');
        // Remove the class after 2 seconds
        setTimeout(() => {
            cartLink.classList.remove('wiggle');
        }, 500);
    }
}


function removeFromCart(itemId, button) {
    //delete the cookie
    deleteCookie(itemId);

    //remove the class remove-from-cart from the button
    button.classList.remove('remove-from-cart');

    console.log(`Item removed from cart: ${itemId}`);


    const language = getCookie('language');


    //Change the button text to add to cart
    if (language === 'de') {
        button.innerHTML = 'In den Warenkorb';
    } else {
        button.innerHTML = 'Add to Cart';
    }
}


function editCartItem(itemId, itemName, itemPrice, button) {
    // Check if the item is in the cart
    if (document.cookie.includes(itemId)) {
        removeFromCart(itemId, button);
    } else {
        addToCart(itemId, itemName, itemPrice, button);
    }

    loadCart();
}

window.onload = function() {
    loadCart();
}

function loadCart() {
    console.log('Loading cart...');
    // Get all Cookies beginning with LAH- and add them to a list
    const cartItems = [];
    for (let cookie of document.cookie.split('; ')) {
        if (cookie.startsWith('LAH-')) {
            try {
                const jsonString = cookie.substring(cookie.indexOf('=') + 1);
                cartItems.push(JSON.parse(jsonString));
            } catch (e) {
                console.error('Error parsing JSON from cookie:', e);
                console.error('Cookie:', cookie);
            }
        }
    }

    // Get all cart elements
    const carts = document.getElementsByClassName('cart');
    
    // Loop through each cart element
    Array.from(carts).forEach(cart => {
        //remove all children of the cart element
        while (cart.firstChild) {
            cart.removeChild(cart.firstChild);
        }
    });

    Array.from(carts).forEach(cart => {
        // Add each item to the cart
        for (let item of cartItems) {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
            <div class="ItemHeader">
                <h3 class="ItemTitle">${item.name}</h3>
                <p class="ItemID">ID: ${item.id}</p>
            </div>
            <p class="ItemPrice">${item.price} €</p>
            <select class="item-options">
                <option value="download" selected>Download</option>
                <option value="dvd">DVD</option>
                <option value="book">Book</option>
            </select>
            <button class="add-to-cart" onclick="editCartItem('${item.id}', '${item.name}', '${item.price}', this);">Aus dem Warenkorb entfernen</button>
            `;
            cart.appendChild(cartItem);
        }
    });
}


window.addEventListener('scroll', function() {
    const shoppingCart = document.querySelector('.shopping_cart');
    if (shoppingCart) {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        if (scrollPercent >= 15) {
            shoppingCart.style.display = 'flex';
        } else {
            shoppingCart.style.display = 'none';
        }
    }
});

