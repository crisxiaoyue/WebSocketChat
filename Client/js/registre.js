var ws = new WebSocket("ws://127.0.0.1:1337/");

// Called when the connection is opened
ws.onopen = function () {

    console.log("Conexio oberta");
};

var app = new Vue({
    el: '#app',
    data: {
        email: '',
        username: '',
        password: '',
    },
    methods: {
        creaUsuari() {
            if (this.email != '' && this.username != '' && this.password != '') {
                var newUser = {
                    type: "newUser",
                    email: this.email,
                    username: this.username,
                    password: this.password
                }
                var newUserString = JSON.stringify(newUser);
                ws.send(newUserString);
                console.log(newUserString);
            } else {
                alert("Introdueix tots els camps!")
            }


        }
    }
});
ws.onmessage = function (evt) {
    console.log(evt.data);
    var dades = JSON.parse(evt.data);

    switch (dades.type) {
        case "afegeixUser":
            notifica(dades);
            break;
    }
};

function notifica(dades){
    if(dades.missatge == 'incorrecte'){
        alert('Aquest usuari ja existeix a la BD')
    }else if(dades.missatge == 'correcte'){
        window.location = "./index.html"
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