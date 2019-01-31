'use strict';

// Imports
var ChatServer = require('./ChatServer');
var WebSocketServer = require('websocket').server;
var http = require('http');

// Server port
var listenPort = 1337;

var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});
server.listen(listenPort, function() { })

// create the server
var wsServer = new WebSocketServer({
    httpServer: server
});

// This is the main class of the server. Only one instance of this
// class exists. 
var chatServer = new ChatServer();

// This is called on a new connection request
wsServer.on('request', function(request) {
    
    // At the moment we ALWAYS accept the new income connection. 
    // Note that for production applications (security concerns) we need to 
    // check that the request origin is trusted.
    var connection = request.accept(null, request.origin);

    // New connection established so we notify ChatServer
    chatServer.onConnectionOpen(connection);

    // This callback is where we receive new messages. Note that
    // we only account for utf8 (strings) messages (no binary).
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // Notify about the message to ChatServer
            chatServer.onConnectionMessage(connection, message.utf8Data)
        }
    });

    // This callback will be called when the connection is closed  
    connection.on('close', function(con) {
        // Notify ChatServer about the closed connection
        chatServer.onConnectionClose(connection);
    });
});