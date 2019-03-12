'use strict';
var ClientData = require('./ClientData');
var BaseDades = require('./BaseDades');
// This is our main server class
class ChatServer {

  constructor() {
    // We declare new attributes in here, ex:
    // this.foo = 0
    //this.listClients = {};
    this.listClients = new Map();
    this.compt = 1;
    this.bd = new BaseDades();
    this.bd.creaConnexio();
  }

  // Called when a new connection 'con' is opened
  onConnectionOpen(con) {
    // Assignem la connexió al client
    //let newClient = new ClientData(con);
    let newClient = new ClientData(con, 'usuariProva' + this.compt);
    //this.bd.consultaUsuaris();

    // afegim la connexió del nou client al llistat.
    this.listClients.set(con, newClient);

    console.log("llista clients: " + this.listClients);
    console.log("Conexio establerta: ", con.remoteAddress);
    this.enviaNomsClients();
    this.compt++;

  }

  // Called when connection 'con' is closed
  onConnectionClose(con) {
    this.listClients.delete(con);
    console.log(this.listClients.size);
    console.log("Conexio tancada: ", con.remoteAddress);
    this.enviaNomsClients();

  }



  // TIPUS DE MISSATGES:
  /**
   * 1 - Servidor rep un missatge, i l'ha d'assignar el nom d'usuari que ha enviat el missatge i fer un broadcast als clients.
   * 
   * 2 -  S'envia la llista de clients en mode Broadcast
   * 
   * 5 - S'envia al client el missatge amb el usuari corresponent.
   */
  // Called when a string message 'msg' from 'con' is received
  onConnectionMessage(con, msg) {
    var data = JSON.parse(msg);

    switch (data.type) {
      case "1":
        var userMessage = {
          type: "5",
          user: this.listClients.get(con).getUsername(),
          missatge: data.msg
        }
        var userMessageString = JSON.stringify(userMessage);
        this.enviaBroadcastClients(userMessageString);
        break;
      case "4":
        // mirar si el nom esta repetit o no:
        this.listClients.get(con).setUsername(data.nomActualitzat);
        console.log("nou nom " + data.nomActualitzat);
        console.log("id " + data.idUser);
        this.bd.canviaNom(data.idUser,data.nomActualitzat);
        this.enviaNomsClients();
        break;
      case "login":
        this.bd.comprovaUsuari(data.user,data.password,con,this);
        break;

    }

  }

  enviaBroadcastClients(data) {
    this.listClients.forEach((client, con) => {
      this.listClients.get(con).getConnection().sendUTF(data);
    })
  }
  enviaNomsClients() {
    var nomUsuaris = {
      type: '2', // el tipus 1 serà un missatge, i el tipus 2 serà la llista de clients.
      usuaris: []
    };

    // Afegeixo el nom de l'usuari a l'array usuaris de l'objecte creat.
    this.listClients.forEach((client, con) => {
      if (this.listClients.get(con).isAuth() == true) {
        nomUsuaris.usuaris.push(client.getUsername());
     }
    });
    // Envio a cada client la llista dels usuaris.
    this.listClients.forEach((client, con) => {
      var llistaNomUsuaris = JSON.stringify(nomUsuaris);
      con.sendUTF(llistaNomUsuaris);
    });

  }

  onSqlAnswer(con, result) { // Per saber quina consulta és el resultat de la query
    // TO DO
    // Comprovar que la con existeix, podria desconectarse l'usuari.
    console.log(result);
    if (result.length > 0) {
      // comprovo que la connexió del client està oberta.
      if(this.listClients.get(con) != undefined){
        this.enviaMissatgeLogin(con,result);
        console.log(result[0].id);
        // actualitzar auth
        this.listClients.get(con).setAuth(true);
        console.log(this.listClients.get(con).isAuth());
        // canviar nickname
        this.listClients.get(con).setUsername(result[0].username)
        
        console.log(this.listClients.get(con).getUsername());
        // broadcast de llista client. o si es canvia de nom tambe senviara el broadcast de clients
        // s'ha de enviar la llista de clients nomes als que s'han autentificat. 
        this.enviaNomsClients();

        console.log("Usuari loginejat.")
      }

    }
    else{
      console.log("No s'ha trobat la dada");
      this.tornaFerLogin(con);
    }

  }

  enviaMissatgeLogin(con,result){
    var obj = {
      type:'IniciaSessio',
      missatge: 'correcte',
      username : result[0].username
    }
    var objStr = JSON.stringify(obj)
    this.listClients.get(con).getConnection().sendUTF(objStr)
  }

  tornaFerLogin(con){
    var obj = {
      type:'IniciaSessio',
      missatge: 'incorrecte'
    }
    var objStr = JSON.stringify(obj)
    this.listClients.get(con).getConnection().sendUTF(objStr)
  }
}
// We export our class so we can import it later with 'require'
module.exports = ChatServer;