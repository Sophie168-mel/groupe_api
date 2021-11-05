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


// Mise au propre du data frame rezo pouce
code_insee = []

for(var i = 0; i < df2.shape[0]; i++){
    code_insee.push(df2.loc({ rows: [i], columns: ["commune"] }).values[0][0]["codeCommune"])
}

df2["commune"] = code_insee
df2 = df2.loc({columns: ["commune","latitude","longitude","nom"]}) 
df2.rename({ mapper: {"commune": "code_commune", "nom":'commentaire'},inplace: true })

//df2.print()

// Mise au propre du data frame commune_departement_region
df1 = df1.loc({columns: ["nom_commune", "code_commune_INSEE", "nom_departement","code_departement", "nom_region", "code_region"]})
df1["code_commune_INSEE"].print()
df1["code_commune_INSEE"] = df1["code_commune_INSEE"].apply((x) => String(x).padStart(5, "0"))
df1.rename({mapper : {"code_commune_INSEE":"code_commune"}, inplace: true})


df = dfd.merge({ "left": df1, "right": df2, on: ["code_commune"], how: "right"})
df.reset_index({ inplace: true })

var id = []
for(i = 0; i < df.shape[0]; i++){
    id.push(i)
}

df.addColumn({ "column": "id", "values": id, inplace: true });
df.print()
df.to_csv({ filePath: "df_rezoPouce_commune.csv"});