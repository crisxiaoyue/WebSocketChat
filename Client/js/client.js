'use strict';
// Connect using WebSocket to the chat server address
var ws = new WebSocket("ws://127.0.0.1:1337/");

// Called when the connection is opened
ws.onopen = function () {
    // en cas que tingui la sessió oberta
    if (sessionStorage.length > 0) {
        onSessioOberta();
    }
    console.log("Conexio oberta");
};

// Called when a new message is received
ws.onmessage = function (evt) {
    console.log(evt.data);
    var dades = JSON.parse(evt.data);

    switch (dades.type) {
        case "5":
            creaMissatge(dades, nickname);
            break;
        case "2":
            repLlista(dades);
            break;
        case "IniciaSessio":
            comprovaInici(dades);
            break;
        case "canviNom":
            notificaUsuari(dades);
            break;
        case "foto":
            actualitzaFoto(dades);
            break;
           
    }

};

/**
 * PART FITXER DE LOGIN
 */
var nickname;
var nomUser = nickname;
var correu;
var pass;

// Comprovo la sessió si està oberta
if (sessionStorage.getItem("usuari") === null) {
    document.getElementById("login").style.display = 'block';
    document.getElementById("menu").style.display = 'none';
} else {
    document.getElementById("login").style.display = 'none';
    document.getElementById("menu").style.display = 'none';
}

function actualitzaFoto(dades){
    console.log("acutalitzara la foto?");
    document.getElementById("user").src =dades.foto;
}

/**
 * Mètode que en cas de tenir la sessió oberta, obté les dades per fer el login.
 */
function onSessioOberta() {
    var usuariLogin = {
        type: "login",
        user: sessionStorage.getItem("usuari"),
        password: sessionStorage.getItem("password")
    }
    var loginString = JSON.stringify(usuariLogin);
    ws.send(loginString);
    console.log(loginString);
   
}
var app = new Vue({
    el: '#app',
    data: {
        email: '',
        passwd: '',
        nouNom: '',
        missatge: '',
        novaFoto: ''
    },
    methods: {
        iniciaSessio: function (event) {
            correu = this.email;
            pass = this.passwd;
            var usuariLogin = {
                type: "login",
                user: this.email,
                password: this.passwd
            }
            var loginString = JSON.stringify(usuariLogin);
            ws.send(loginString);
            console.log(loginString);
        },
        canviaNom() {
            if (this.nouNom != '') {
                var nouUserName = {
                    type: "4",
                    idUser: this.email,
                    nomActualitzat: this.nouNom
                }
                var nomUserNameString = JSON.stringify(nouUserName);
                ws.send(nomUserNameString);
                nomUser = this.nouNom;
                nickname = this.nouNom;
                this.nouNom = '';
            }
        },
        // Mètode que envia un missatge de l'usuari actual al servidor 
        enviaMissatge: function (event) {

            console.log(this.missatge);
            var missatgeAEnviar = {
                type: '1', 
                msg: this.missatge
            };

            var messageString = JSON.stringify(missatgeAEnviar);
            ws.send(messageString);
            this.missatge = '';
            window.scrollTo(0, document.querySelector("#scrollMissatges").scrollHeight);
        },
        tancaSessio: function (event) {
            sessionStorage.clear();
            document.getElementById("login").style.display = 'block';
            document.getElementById("menu").style.display = 'none';
        },
        canviaImatge: function(event){
            var objFto = {
                type : "foto",
                idUser : this.email, 
                foto : this.novaFoto
            }
            var ftoString = JSON.stringify(objFto);
            ws.send(ftoString);
            this.novaFoto = ''
        }

    }
})

/**
 * Mètode que comprova que l'inici sigui el correcte.
 * @param {*} dades 
 */
function comprovaInici(dades) {
    if (dades.missatge == 'correcte') {
        comprovaSessio(correu, pass)
        document.getElementById("login").style.display = 'none';
        document.getElementById("menu").style.display = 'inline';
        nickname = dades.username;
    } else if (dades.missatge == 'incorrecte') {
        alert("Login Incorrecte!")
    }
}

/**
 * Mètode que comprova la sessió si està definida, i en cas de no estar-ho afegeix els valors de login de l'usuari
 * @param {*} idUser 
 * @param {*} password 
 */
function comprovaSessio(idUser, password) {
    if (typeof (Storage) !== "undefined") {
        // Guardo l'id d'usuari a la Sessió 
        sessionStorage.setItem("usuari", idUser);
        sessionStorage.setItem("password", password)
        sessionStorage.isNewSession = true;
    } else {
        document.getElementById("login").style.display = 'none';
        document.getElementById("menu").style.display = 'inline';
    }
}

let compt = 0;


/**
 * Mètode que "pinta" un missatge nou a la finestra de Xat. 
 * Rep per paràmetre el missatge, i l'usuari actual de la sessió iniciada.
 * @param {*} dades 
 * @param {*} username 
 */
function creaMissatge(dades, username) {
    // Si l'ha enviat l'usuari l'alinio a la dreta, en cas contrari a l'esquerra.
    if (dades.missatge != '') {
        if (dades.user == username) {
            var node = document.createElement("LI");
            node.classList.add("list-group-item");
            node.classList.add("enviat");
            var textnode = document.createTextNode(dades.user + ": " + dades.missatge);
            node.appendChild(textnode);
            var temps = document.createElement("span");
            var dataActual = new Date();
           
            var textTemps = document.createTextNode(dataActual.toLocaleTimeString());
            temps.appendChild(textTemps);
            temps.classList.add("time_date_right");
            document.getElementById("messages").appendChild(node);
            document.getElementById("messages").appendChild(temps);
        } else {
            var node = document.createElement("LI");
            node.classList.add("list-group-item");
            node.classList.add("rebut");
            var textnode = document.createTextNode(dades.user + ": " + dades.missatge);
            node.appendChild(textnode);
            var temps = document.createElement("span");
            var dataActual = new Date();
           
            var textTemps = document.createTextNode(dataActual.toLocaleTimeString());
            temps.appendChild(textTemps);
            temps.classList.add("time_date_left");
            document.getElementById("messages").appendChild(node);
            document.getElementById("messages").appendChild(temps);
        }
    }
    // Baixo l'scroll del div de missatges per cada missatge creat. 
    baixaScroll();

}

/**
 * Mètode que baixa automàticament l'scroll del div dels missatges, perque l'usuari vegi sempre els últims missatges rebuts
 */
function baixaScroll() {
    var element = document.getElementById("scrollMissatges");
    element.scrollTop = element.scrollHeight;
}

/**
 * Mètode que notifica a l'usuari en cas de que el nickname que vol modificar ja existeixi a la base de dades.
 * @param {*} dades 
 */
function notificaUsuari(dades) {
    if (dades.missatge == 'incorrecte') {
        alert('Ja existeix aquest nickname a la Base de Dades!')
    }
}

/**
 *  Mètode que rep la llista del noms de clients connectats, i la mostra a cada usuari.
 * @param {*} dades 
 */
function repLlista(dades) {
    // Elimino els elements de la llista usuaris en l'HTML.
    eliminaLlistaUsuaris();
    dades.usuaris.forEach(function (element) {
        // definició de cards de cada usuari 
        var divCardSuprem = document.createElement("div");
        divCardSuprem.classList.add("card");
        divCardSuprem.classList.add("bg-dark");
        divCardSuprem.classList.add("text-center");

        var divRow = document.createElement("div");
        divRow.classList.add("row");

        var divColImg = document.createElement("div");
        divColImg.classList.add("col-md-4");

        var img = document.createElement("img");
        img.classList.add("w-100");
        img.classList.add("rounded");
        if(nickname == element){
            img.id = "user";
        }
       
        img.src = "https://picsum.photos/200/200/?random&" + compt;
        var divColCard = document.createElement("div");
        divColCard.classList.add("col-md-8");

        var divCardBody = document.createElement("div");
        divCardBody.classList.add("card-body");

        var p = document.createElement("p");
        p.classList.add("text-light");
        p.classList.add("card-title");
        var textp = document.createTextNode(element);
        p.appendChild(textp);

        divCardBody.appendChild(p);
        divColCard.appendChild(divCardBody);
        divColImg.appendChild(img);
        divRow.appendChild(divColImg);
        divRow.appendChild(divColCard);
        divCardSuprem.appendChild(divRow);

        document.getElementById("users").appendChild(divCardSuprem);
        compt++;
    });
}

/**
 * Mètode que elimina la llista d'usuaris per tal de tenir-la actualitzada.
 */
function eliminaLlistaUsuaris() {
    var myNode = document.getElementById("users");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

// Called when the connection is closed
ws.onclose = function () {
    console.log("Conexio tancada");
    alert('Error amb la connexió del Chat! Torna ens uns minuts...')
    
};

// Called when an error with the connection happened
ws.onerror = function (err) {
    console.log("Error en la conexio");
};