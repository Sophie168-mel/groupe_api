var fetch = require("node-fetch");
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

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
    cd_insee.push(ind["code_commune_INSEE"])
}

// On fetch pour chaque code insee "rezo pouce"
var stockage_rezoPouce = []
var i = 1
for(insee of cd_insee){
    insee = insee.padStart(5, "0");
    console.log(i)
    url_rezoPouce =  "https://www.rezopouce.fr/json/communes/" + insee + "/points-arret"
    fetch(url_rezoPouce)
        .then(function(response){
            return response.text()
        })
            .then(function(text){
                localStorage.setItem("rezoPouce.json", text)
            })
            

    individu_rezoPouce = localStorage.getItem("rezoPouce.json")
    stockage_rezoPouce.push(individu_rezoPouce)
    i+=1
    console.log(stockage_rezoPouce)
}

















/*
var fetch = require("node-fetch");
var dfd = require("danfojs-node");

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

url_csv = "./commune.csv"

dfd.read_csv(url_csv)
    .then(df => { 

        var urls = [];
        var df_size = df["COM"].shape[0];
        
        for (let i = 0; i < df_size; i++){

            cd_com = df.loc({rows:[i], columns: ["COM"]}).values[0][0]
            cd_com = String(cd_com).padStart(5, "0")
            var url = "https://www.rezopouce.fr/json/communes/" + cd_com + "/points-arret"
            
            urls.push(url)
        }

        
        //console.log(urls.slice(0, 100))
        Promise.all(urls.slice(0, 100).map(url =>
            fetch(url).then(resp => 
                resp.text()).catch(err => 
                    fetch(url).then(resp => resp.text()).catch(err => console.log("erreur : "+url))
                )
        )).then(texts => {
            var texts_filtred = []
            for(elem of texts){
                if(elem.length > 2 ){
                    texts_filtred.push(elem)
                }
            }
            console.log(texts_filtred)
            localStorage.setItem('stockage',texts_filtred)
        })
        

        for(url of urls.splice(0, 100)){

            var l = []
            fetch(url)
            .then(res => {
                return res.text()
            })
            .then(text => {
                localStorage.setItem('stockage',text)
            })
            
            l.push(localStorage.getItem('stockage'))
        }

        console.log(l)

    }).catch(err=>{console.log(err+" erreur");})









var url = "https://www.rezopouce.fr/json/communes/34172/points-arret";

fetch(url)
  .then(response => response.text())
  .then(data => localStorage.setItem('dette',data));

var res = localStorage.getItem('dette');
var res = JSON.parse(res);

function Create_ind(json){
  var cd_commune = json[0]['commune']['codeCommune'];
  var description = json[0]['nom'];
  var lat = json[0]['latitude'];
  var long = json[0]['longitude'];
  var monJson = "[{\"code_commune\": "+ cd_commune +", \"description\": \"" + description + "\", \"latitude\": " + lat + ", \"longitude\": " + long + "}]"
  var monJson = JSON.parse(monJson)
  var df = new dfd.DataFrame(monJson)
  return df
}

//df = Create_ind(res)
//df.print()

//console.log("1001".padStart(5, "0"))
*/
