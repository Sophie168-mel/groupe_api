var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
const dfd = require("danfojs-node")

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

data_commune = localStorage.getItem("data_commune.csv")
data_rezoPouce = localStorage.getItem("data_rezoPouce.json")

data_commune = csv_to_json(data_commune)
data_rezoPouce = JSON.parse(data_rezoPouce)

let df1 = new dfd.DataFrame(data_commune)
let df2 = new dfd.DataFrame(data_rezoPouce)

df2.print()

//console.log(df2.loc({ rows: [0], columns: ["commune"] }).values[0][0]["codeCommune"])

code_insee = []
for(var i = 0; i < df2.length; i++){
    console.log(df2.loc({ rows: [i], columns: ["commune"] }).values)
}