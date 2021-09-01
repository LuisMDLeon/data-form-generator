let lastElementClicked = null;

function updateLastInput($element){
    const tagName = $element.tagName;
    const type = $element.type;

    if (tagName=== 'INPUT' && (type === 'tel' || type === 'email' || type === 'text')) 
        lastElementClicked = $element;
    else lastElementClicked = null;

    chrome.runtime.sendMessage({greeting: "updateLastInput", type: (lastElementClicked ? type : null)}, function(response) {
        console.log(response.msg);
    });
}

function setInputValue(value) {
    lastElementClicked.value = value;
}


document.addEventListener('contextmenu', (e) => {
    const $element =  e.target;
    updateLastInput($element);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.greeting === 'setData'){ setInputValue(request.data); }
    }
);