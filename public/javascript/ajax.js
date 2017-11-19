// Function to make async request

function ajaxGet(url, callback ,header_name, header_value) {
    var req = new XMLHttpRequest();
    
    if(header_value && header_name){
        req.setRequestHeader(header_name, header_value)
    }
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // when request is done call the callback
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Eroor with this URL " + url);
    });
    req.send(null);
}