var fetch = require("node-fetch");
var dfd = require("danfojs");
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

var url = "https://www.rezopouce.fr/json/communes/34172/points-arret";

fetch(url)
  .then(response => response.text())
  .then(data => localStorage.setItem('dette',data));

var res = localStorage.getItem('dette');
var res = JSON.parse(res);

function code_commune(json){
  var cd_commune = json[0]['commune']['codeCommune'];
  var description = json[0]['nom'];
  var lat = json[0]['latitude'];
  var long = json[0]['longitude'];

  return "[{\"code_commune\": "+ cd_commune +", \"description\": \"" + description + "\", \"latitude\": " + lat + ", \"longitude\": " + long + "}]"
}

test = code_commune(res)
test = JSON.parse(test)
df = new dfd.DataFrame(test)
df.print()