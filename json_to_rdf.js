// https://www.w3.org/2003/01/geo/
// https://www.w3.org/wiki/GeoRDF
// https://www.w3.org/RDF/Validator/
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
myJson_nodes = myJson["nodes"];

var myRdf = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n\t\
xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\n\t\
xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"\n\t\
xmlns:dc="http://purl.org/dc/elements/1.1/" \n\t\
xmlns="http://xmlns.com/foaf/0.1/">'

function individu_rdf(json_individu){
    //////////////////////////////////////////////////////////////////////////
    // 
    //////////////////////////////////////////////////////////////////////////

    var res = '<Point>\n';
    clefs = Object.keys(json_individu);

    // Je construit ma réponse res
    for(key of clefs){
        var key_value = json_individu[key];

        if(key == 'id'){
            res += '<id>'+json_individu['id']+'</id>'
        }
        else if(key == 'latitude'){
            res += '<based_near geo:lat="' + json_individu['latitude'] + '" geo:long="' + json_individu['longitude'] + '"/>'
        }

        else if(key == 'commentaire'){
            
        }   

        res += '\t<' + key + '>' + key_value + '</' + key + '>\n';
    }
    res += '</Point>';

    return res;
}

console.log(myRdf)