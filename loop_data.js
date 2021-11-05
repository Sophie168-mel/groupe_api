var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('');

const myCsv = localStorage.getItem('df_rezoPouce_commune.csv');

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
    console.log(myJson[i])
}
