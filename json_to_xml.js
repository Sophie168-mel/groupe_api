const myJson = require('./miserables.json');
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

// Fonction pour faire un string correspondant au format xml à partir d'un individu json

function individu_xml(json_individu){
    //////////////////////////////////////////////////////////////////////////
    // prend un individu d'un json et renvoie l'individu json sous forme xml//
    //////////////////////////////////////////////////////////////////////////

    var res = '<point>\n';
    clefs = Object.keys(json_individu);

    // Je construit ma réponse res
    for(key of clefs){
        var key_value = json_individu[key];
        res += '\t<' + key + '>' + key_value + '</' + key + '>\n';
    }
    res += '</point>';

    return res;
}

function json_to_xml(json_to_convert){
    ///////////////////////////////////////////////////////////////////////////////
    // Convertit un json avec une classe contenant des enfant sans enfants en xml//
    ///////////////////////////////////////////////////////////////////////////////

    var myXml = '<?xml version="1.0" encoding="UTF-8"?>\n<auto_stop>';
    for(ind of json_to_convert){
        myXml += '\n'+ individu_xml(ind)
    }
    myXml += '\n</auto_stop>';

    return myXml;
}

test = json_to_xml(myJson_point)
console.log(test)
