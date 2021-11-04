// https://www.w3.org/2003/01/geo/
// https://www.w3.org/wiki/GeoRDF
// https://www.w3.org/RDF/Validator/
const { json } = require('express');
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



function individu_rdf(json_individu){
    //////////////////////////////////////////////////////////////////////////
    // 
    //////////////////////////////////////////////////////////////////////////
    var res = "";
    var osm_link;
    
    osm_link = "https://www.openstreetmap.org/query?lat=" + json_individu['latitude'] + "&lon=" + json_individu['longitude'] + "#map=19/" + json_individu['latitude'] + "/" + json_individu['longitude'] + "&layers=N'";
    
    res += '<geo:Point rdf:about="' + osm_link + '" rdf:ID="' + json_individu['id'] + '">\n';
    res += '\t<geo:lat>' + json_individu['latitude'] + '</geo:lat>\n'
    res += '\t<geo:long>' + json_individu['longitude'] + '</geo:long>\n'
    res += '\t<rdf:comment>' + json_individu['commentaire'] + '</rdf:comment>\n'
    res += '</geo:Point>';

    return res;
}

function json_to_rdf(json_to_convert){

    var myRdf;
    myRdf = '<?xml version="1.0"?>\n\<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n\t\
    xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">'

    for(ind of json_to_convert){
        myRdf += '\n' + individu_rdf(ind)
    }

    myRdf += '\n</rdf:RDF>'

    return myRdf;
}

test = json_to_rdf(myJson_point)
console.log(test)