const geofire = require("geofire-common");
const admin = require("firebase-admin");
var serviceAccount = require("./credential.json");

// Connexion à la base de donnée
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('');

const myCsv = localStorage.getItem('data.csv');

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
  };

myJson = csv_to_json(myCsv)

for(let i = 0; i < myJson.length-1; i++){
  let obj = myJson[i]
  try{
    obj["geohash"] = geofire.geohashForLocation([parseFloat(myJson[i]["latitude"]), parseFloat(myJson[i]["longitude"])]);
    db.collection("DataBase").doc(obj["id"]).set(obj).then(()=> {
      console.log("Succes")
    }).catch(err=>{
      console.log(err)
    });
  } catch {
    //console.log(myJson[i])
  }
}