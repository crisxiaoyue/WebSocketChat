'use strict';

// Connect using WebSocket to the chat server address
var ws = new WebSocket("ws://127.0.0.1:1337/");
var nomUser = prompt("introdueix User");
var nom = new Vue({
    el: '#nom',
    data: {
        nouNom: ''
    },
    methods: {
        canviaNom() {
            var nouUserName = {
                type: "4",
                nomActualitzat: this.nouNom
            }
            var nomUserNameString = JSON.stringify(nouUserName);
            ws.send(nomUserNameString);
            nomUser = this.nouNom;
            this.nouNom = '';

        }
    }
})
let compt = 0;
var app = new Vue({
    el: '#app',
    data: {
        username: nomUser,
        missatge: ''
    },
    // define methods under the `methods` object
    methods: {
        // Mètode que envia un missatge de l'usuari actual al servidor 
        enviaMissatge: function (event) {

            console.log(this.missatge);
            var missatgeAEnviar = {
                type: '1', // el tipus 1 serà un missatge, i el tipus 2 serà la llista de clients.
                msg: this.missatge
            };

            var messageString = JSON.stringify(missatgeAEnviar);
            ws.send(messageString);
            this.missatge = '';
        },
        getUsername: function () {
            return this.username;
        }
    }
})



// Called when the connection is opened
ws.onopen = function () {
    console.log("Conexio oberta");
    // Send "Hello Server" string to the Server
    var nameUser = {
        type: '3',
        username: nomUser
    };
    var usuariString = JSON.stringify(nameUser);
    ws.send(usuariString)
};

// Called when a new message is received
ws.onmessage = function (evt) {
    console.log(evt.data);
    var dades = JSON.parse(evt.data);
    //console.log("Missatge rebut: ", dades);

    switch (dades.type) {
        case "5":
            creaMissatge(dades, app.getUsername());
            break;
        case "2":
            repLlista(dades);
            break;
    }

};

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
            document.getElementById("messages").appendChild(node);
        } else {
            var node = document.createElement("LI");
            node.classList.add("list-group-item");
            node.classList.add("rebut");
            var textnode = document.createTextNode(dades.user + ": " + dades.missatge);
            node.appendChild(textnode);
            document.getElementById("messages").appendChild(node);
        }
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
};

// Called when an error with the connection happened
ws.onerror = function (err) {
    console.log("Error en la conexio");
};
