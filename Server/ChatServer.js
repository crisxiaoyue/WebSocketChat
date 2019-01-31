'use strict';

// This is our main server class
class ChatServer {

  constructor() {
    // We declare new attributes in here, ex:
    // this.foo = 0
  }

  // Called when a new connection 'con' is opened
  onConnectionOpen(con) {
    console.log("Conexio establerta: ", con.remoteAddress);
  }

  // Called when connection 'con' is closed
  onConnectionClose(con) {
    console.log("Conexio tancada: ", con.remoteAddress);
  }

  // Called when a string message 'msg' from 'con' is received
  onConnectionMessage(con, msg) {
    console.log("Missatge rebut de (", con.remoteAddress, ") :", msg);
  
    // Send a response to the client
    con.sendUTF('Hello Client');
  }
}

// We export our class so we can import it later with 'require'
module.exports = ChatServer;