// Fonction pour faire un string correspondant au format xml à partir d'un individu json

function individu_xml(json_individu) {
  //////////////////////////////////////////////////////////////////////////
  // prend un individu d'un json et renvoie l'individu json sous forme xml//
  //////////////////////////////////////////////////////////////////////////

  var res = "<point>\n";
  clefs = Object.keys(json_individu);

  // Je construit ma réponse res
  for (key of clefs) {
    var key_value = json_individu[key];
    res += "\t<" + key + ">" + key_value + "</" + key + ">\n";
  }
  res += "</point>";

  return res;
}

exports.json_to_xml = function (json_to_convert, isCompute = false) {
  ///////////////////////////////////////////////////////////////////////////////
  // Convertit un json avec une classe contenant des enfant sans enfants en xml//
  ///////////////////////////////////////////////////////////////////////////////
  
  if (isCompute) {
    var myXml = '<?xml version="1.0" encoding="UTF-8"?>\n<Nombre>';
    myXml += "\n\t<xsd:integer>" + json_to_convert["resultat"] + "</xsd:integer>";
    myXml += "\n</Nombre>";
  } else {
    var myXml = '<?xml version="1.0" encoding="UTF-8"?>\n<auto_stop>';
    for (ind of json_to_convert) {
      myXml += "\n" + individu_xml(ind);
    }
    myXml += "\n</auto_stop>";
  }


  return myXml;
};

var test = false;
if (test == true) {
  const myJson = require("./miserables.json");
  /*
    myJson :
        ► nodes 
            • id
            • name
            • group
        ► links
            • source
            • target
            • value
    */

  // Je travail sur nodes : myJson_nodes
  myJson_point = myJson["point"];
  test = json_to_xml(myJson_point);
  console.log(test);
}
