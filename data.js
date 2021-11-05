var fetch = require("node-fetch");
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');


// on récupére toute la donnée venant de data.gouv
var url_commune = "https://www.data.gouv.fr/fr/datasets/r/dbe8a621-a9c4-4bc3-9cae-be1699c5ff25";
fetch(url_commune)
    .then(function(response){
        return response.text()
    })
        .then(function(text){
            localStorage.setItem("data_commune.csv", text)
        });

// On récupère la commune 01033 de rezoPouce
var url_rezoPouce = "https://www.rezopouce.fr/json/communes/01033/points-arret"
fetch(url_rezoPouce)
    .then(function(response){
        return response.json()
    })
        .then(function(json){
            localStorage.setItem("data_rezoPouce.json",  JSON.stringify(json))
        });
