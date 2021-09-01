const optionsId = ['phoneNumber', 'email'];
const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const emailConfig = {
    name: 'luis',
    domain: 'test',
    useRandomNUmber: false
};
const phoneNumberConfig = {
    countryCode: false,
};

let currentType = null;

function generateEmail(info, tab) {
    if (!currentType) return;
    const name = emailConfig.name;
    const domain = emailConfig.domain;

    let s = '';
    if (emailConfig.useRandomNUmber) s = Number.parseInt(Math.random() * 1000000000);
    else {
        const d = new Date;
        const day = pad(d.getDate()), hour = pad(d.getHours()), minutes = pad(d.getMinutes());
        s = `${day}${months[d.getMonth()]}${hour}${minutes}${d.getSeconds()}`
    }

    updateInputValue(`${name}@${s}.${domain}`);
}

function generatePhoneNumber(info, tab) {
    if (!currentType) return;
    const countryCode = (phoneNumberConfig.countryCode) ? '+' + Number.parseInt(Math.random() * 100) : '';
    const number = Number.parseInt(Math.random() * 10000000000);

    updateInputValue(`${countryCode}${number}`);
}

function pad(num) {
    var s = "0" + num;
    return s.substr(s.length-2);
}

function updateInputValue(data) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: 'setData', data}, function(response) {});
    });
}

chrome.contextMenus.create({
    id: 'phoneNumber',
    title: 'Phone number (10 digits)',
    contexts: ['editable'],
    onclick: generatePhoneNumber
});

chrome.contextMenus.create({
    id: 'email',
    title: 'Email (name@{date|rnd(10)}.dom)',
    contexts: ['editable'],
    onclick: generateEmail
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting === "updateLastInput")  {
            currentType = request.type;
            sendResponse({msg: "Input UPDATED"});
        }
    }
);