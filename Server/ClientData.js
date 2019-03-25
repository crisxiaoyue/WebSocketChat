'use strict';

// This is our main client data class
class ClientData {


  // Assignem per defecte un nom d'usuari per si fallés la connexió entre el Client i el Servidor.
  constructor(con,username) { // camp nou booleà de autentificat o no.
    // We declare new attributes in here, ex:
    // this.foo = 0
    this.con = con;
    this.username = username;
    this.auth = false; 
    this.foto = '';
  }

  // Getter of connection
  getConnection(){
    return this.con;
  }

  // Setter of connection
  setConnection(con){
    this.con = con;
  }

  getUsername(){
    return this.username;
  }
  setUsername(username){
    this.username = username;
  }
  getFoto(){
    return this.foto;
  }
  setFoto(foto){
    this.foto = foto;
  }
  isAuth(){
    return this.auth;
  }
  setAuth(auth){
    this.auth = auth;
  }

}

// We export our class so we can import it later with 'require'
module.exports = ClientData;