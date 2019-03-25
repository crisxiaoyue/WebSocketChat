
var mysql = require('mysql');
class BaseDades {

    constructor() {
        this.con = '';
    }
    creaConnexio() {
        this.con = mysql.createConnection({
            host: "213.98.130.142",
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
                chatServer.onSqlAnswerLogin(con, result);  // Se suposa que els parametres necessaris s'han copiat automaticament i son reconeguts al context sino 
            }
        })
    }
    canviaNom(usuari,nickname){
       // comprovaNom(nickname);
        let sql = "UPDATE Clients SET username = '" + nickname +"' WHERE id = '" + usuari + "';" 
        this.con.query(sql, function (err, result) {   //Quan arriba el resultat “…” -> executa la funcio (func(err,result)) 
            //En aquests moments no es fa res mes fins rebre la resposta.
            if (result) {
               console.log("dada actualitzada!")
            }
        })
    }
    comprovaNom(id, nickname,con,chatServer){
        let sql = "SELECT * FROM Clients WHERE username = '" + nickname + "';"
        this.con.query(sql, function (err, result) {   //Quan arriba el resultat “…” -> executa la funcio (func(err,result)) 
            //En aquests moments no es fa res mes fins rebre la resposta.
            if (result) {
                chatServer.onSqlAnswerNom(id, nickname,con, result);  
            }
        })
    }
    comprovaEmail(email,username,password,con,chatServer){
        let sql = "SELECT * FROM Clients WHERE id = '" + email + "';"
        this.con.query(sql, function (err, result) {   //Quan arriba el resultat “…” -> executa la funcio (func(err,result)) 
            //En aquests moments no es fa res mes fins rebre la resposta.
            if (result) {
                chatServer.onSqlAnswerEmail(email,username,password,con,result);  
            }
        })
    }

    afegeixUsuari(email,username,password){
        let sql = "INSERT INTO Clients VALUES ('" + email + "', '"+ username +"', '"+ password +"', '' );";
        this.con.query(sql, function (err, result) {   //Quan arriba el resultat “…” -> executa la funcio (func(err,result)) 
            //En aquests moments no es fa res mes fins rebre la resposta.
            if (result) {
               console.log("dada inserida"); 
            } 
            if(err){
                console.log(err);
            }
        })
    }
    afegeixFoto(idUser,foto){
        let sql = "UPDATE Clients SET foto = '" + foto +"' WHERE id = '" + idUser + "';" 
        this.con.query(sql, function (err, result) {   //Quan arriba el resultat “…” -> executa la funcio (func(err,result)) 
            //En aquests moments no es fa res mes fins rebre la resposta.
            if (result) {
               console.log("foto actualitzada!")
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