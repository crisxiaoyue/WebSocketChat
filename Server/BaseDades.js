
var mysql = require('mysql');
class BaseDades {

    constructor() {
        this.con = '';
    }
    creaConnexio() {
        this.con = mysql.createConnection({
            host: "192.168.0.88",
            database: "cristina_chat",
            user: "cristina",
            password: "patata333"
        });
        this.con.connect(function (err) {
            if (err) throw err;
            console.log("Connectat!");
        });
    }

    consultaUsuaris() {
        let sql = "SELECT * FROM Clients";
        this.con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Result: ", result);
        });
    }
    comprovaUsuari(usuari, psw, con, chatServer) { // 'con' o algún identificador unic  || Parametres necessaris en el context de la funció posterior (con,chatServer)
        let sql = "SELECT * FROM Clients WHERE id='" + usuari + "' and password='" + psw + "';";
        this.con.query(sql, function (err, result) {   //Quan arriba el resultat “…” -> executa la funcio (func(err,result)) 
            //En aquests moments no es fa res mes fins rebre la resposta.
            if (result) {
                chatServer.onSqlAnswer(con, result);  // Se suposa que els parametres necessaris s'han copiat automaticament i son reconeguts al context sino 
            }
        })
    }
    canviaNom(usuari,nickname){
        let sql = "UPDATE Clients SET username = '" + nickname +"' WHERE id = '" + usuari + "';" 
        this.con.query(sql, function (err, result) {   //Quan arriba el resultat “…” -> executa la funcio (func(err,result)) 
            //En aquests moments no es fa res mes fins rebre la resposta.
            if (result) {
               console.log("dada actualitzada!")
            }
        })
    }


}

module.exports = BaseDades;


/**
 *

----------------------------------
// Problemàtica dels event a JS, S'executaran sempre a posteriori!

Class BD{
	constructor() { … }
	// Àmbit de visibilitat!
	comprovarUser(usuari, psw, con, chatServer ) { // 'con' o algún identificador unic  || Parametres necessaris en el context de la funció posterior (con,chatServer)
		con.query(“….” , func (err , result) {   //Quan arriba el resultat “…” -> executa la funcio (func(err,result))
        //En aquests moments no es fa res mes fins rebre la resposta.
            if(result){
                chatServer.onSqlAnswer(con,result);  // Se suposa que els parametres necessaris s'han copiat automaticament i son reconeguts al context sino
                }
        }
}

//------------------------------------------------------------------------------------------------------------------------------

Class ChatServer {
	onConnectionMessage(con){
	switch(tipus) {
		case Login:
			this.bd.comprovaUsuari(user,psw,con,this);
			break;
	}
}

onSqlAnswer(con, result) { // Per saber quina consulta és el resultat de la query
    // TO DO
    // Comprovar que la con existeix, podria desconectarse l'usuari.
    if(result = ok){
		envairMissatgeLoginOK();
	}
	else(){
		TornarAferLogin();
	}
}
 */