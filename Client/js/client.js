'use strict';

// Connect using WebSocket to the chat server address
var ws = new WebSocket("ws://127.0.0.1:1337/");

// Called when the connection is opened
ws.onopen = function() {
    console.log("Conexio oberta");

    // Send "Hello Server" string to the Server
    ws.send("Hello Server");
};

// Called when a new message is received
ws.onmessage = function (evt) {
    console.log("Missatge rebut: ", evt.data);
};

// Called when the connection is closed
ws.onclose = function() {
    console.log("Conexio tancada");
};

// Called when an error with the connection happened
ws.onerror = function(err) {
    console.log("Error en la conexio");
};
