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



/*
// conversion d'un csv en json
function csv_to_json(csv){
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
    }
    return result; //JSON
  }

// on récupére toute la donnée venant de data.gouv
var url_commune = "https://www.data.gouv.fr/fr/datasets/r/dbe8a621-a9c4-4bc3-9cae-be1699c5ff25"
fetch(url_commune)
    .then(function(response){
        return response.text()
    })
        .then(function(text){
            localStorage.setItem("data_commune.csv", text)
        })

// On transforme le csv en json
data_commune_csv = localStorage.getItem("data_commune.csv")
data_commune_json = csv_to_json(data_commune_csv)

// On récupère tous les codes INSEE
var cd_insee = [];
for(ind of data_commune_json){
    cd_insee.push(ind["code_commune_INSEE"].padStart(5, "0"))
}

// On fetch chaque departement
localStorage.setItem("rezoPouce.json", "")
for(insee of cd_insee.slice(0,100)){
    url_rezoPouce = "https://www.rezopouce.fr/json/communes/" + insee + "/points-arret"
    fetch(url_rezoPouce)
        .then(function(response){
            return response.text()
        })
        .catch(function(err){
            console.log("")
        })
            .then(function(text){
                if(text[0] == "[" & text.slice(-1) == "]" & text.length > 2){
                    localStorage.setItem("rezoPouce.json", localStorage.getItem("rezoPouce.json")  + text + "\n")
                }
            })
            .catch(function(err){
                console.log("")
            });
}
*/