function sendEmail(data) {
    const scriptURL = "https://script.google.com/macros/s/AKfycby4Tye_-dBTCHBsU9Utf9mG4S4ArfEaXC-IV30tUn1QwUwYv7HiCzZZ3MQ3u10qvW6Bnw/exec";
    fetch(scriptURL, {
        redirect: "follow",
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
            to: "claudius.caspar.laur@gmail.com",
            subject: "Neue Bestellung " + data.orderNumber,
            message: generateMessage(data),
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log("Erfolgreich gesendet:", result);
    })
    .catch(error => {
        console.error("Fehler beim Senden der E-Mail:", error);
    });
}

function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    let data = Object.fromEntries(formData);
    data = addOrderNumber(data);
    const paymentButton = document.querySelector('.payment_button.selected_button');
    data.payment = paymentButton.title;
    const downloadButton = document.querySelector('.download_button.selected_button');
    data.download = downloadButton.title;
    data.products = getProducts();

    console.log(data);
    sendEmail(data);
}

function addOrderNumber(data) {
    //Generate a 5 Digit Order Number with a hashtag in front using Letters and Numbers based on the time in milliseconds and a random number
    const orderNumber = "#" + Math.random().toString(36).substr(2, 5).toUpperCase();
    data.orderNumber = orderNumber;
    return data;
}

function generateMessage(data) {
    let message = `Neue Bestellung ${data.orderNumber}\n\n`;
    message += `Vorname: ${data.first_name}\n`;
    message += `Nachname: ${data.last_name}\n`;
    message += `Sprache der Bestellung: ${getCookie('language')}\n`;
    message += `E-Mail: ${data.email}\n`;
    message += `Firma: ${data.company}\n`;
    message += `Adresse: ${data.adress}\n`;
    message += `PLZ: ${data.zip}\n`;
    message += `Ort: ${data.city}\n`;
    message += `Land: ${data.country}\n`;
    message += `Download: ${data.download}\n\n\n`;
    message += `Zahlung: ${data.payment}\n`;
    message += `Bestellung:\n\n`;
    message += `Produkte:\n${data.products}\n`;
    return message;
}

function getProducts() {
    //get all products from the local storage with an id starting with 'LAH-' and append them in a new line to a string
    let products = '';

    // Get all items from localStorage beginning with LAH- and add them to a list
    const cartItems = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('LAH-')) {
            try {
                getLocalStorageItem(key);
                cartItems.push(JSON.parse(getLocalStorageItem(key)));
            } catch (e) {
                console.error('Error parsing JSON from localStorage:', e);
                console.error('Key:', key);
            }
        }
    }

    for (let item of cartItems) {
        products += `${item.name} - ${item.id} - ${item.type}\n`;
    }
    return products;
}


function selectPayment(button) {
    const paymentButtons = document.querySelectorAll('.payment_button');
    paymentButtons.forEach(button => button.classList.remove('selected_button'));
    button.classList.add('selected_button');
}

function selectDownload(button) {
    const downloadButtons = document.querySelectorAll('.download_button');
    downloadButtons.forEach(button => button.classList.remove('selected_button'));
    button.classList.add('selected_button');
}