

var express = require('express');
var session = require('express-session');
var app = express();
var fs= require('fs')
const port = process.env.PORT || 3000


var convert = require('xml-js');
var json = fs.readFileSync('test_data.json', 'utf8');
var testData = JSON.parse(json);
var options = {compact: true, ignoreComment: true, spaces: 4};
var result = convert.json2xml(testData , options);
console.log(result);

app.get('/', function(req, res){
   res.format({ 
   'xml': function(){  
    res.set('Content-Type', 'application/xml');
    res.send('xml'); 
    res.xml(data); 
  res.location(path)   ; 
    },  
    'application/json': function(){  
      res.set('Content-Type', 'application/json');
      res.send({ message: 'json' }); 
      res.json(data); 
      res.location(path)   ;
    },  
   'default': function() {  
      // log the request and respond with 406  
      res.status(406).send('Not Acceptable');  
    }  
  });  

   res.end()
 });






//RCHTTP: la negociation de contenu (5."")
//coté requete: header accept (le format des données : des MIME type (application/xml, application/text))
//coté réponse: encoding content

app.get(',', function(req, res)){
  res.send(" ...");
}

app.listen(port, function){
  console.log(...)
}


//sends xml, JSON or CSV depending on content negociation
app.get('/score', function(req, res){
  let user = req.session.user ;
  if(!user) res.redirect(307, "/");
  else if(user.answers.length === 0) res.redirect(307, "/");
  else {
    let questioncount = user.answers.length ;
    if(questioncount < 48) res.redirect(307, '/main/' + questioncount)
    else {
            res.format({

            'application/xml': function () {
              res.setHeader('Content-disposition', 'attachment; filename=score.xml'); //do nothing
              res.set('Content-Type', 'application/xml');
              res.json(user);
            },

            'application/xml': function () {
              res.setHeader('Content-disposition', 'attachment; filename=score.xml'); //do nothing
              res.set('Content-Type', 'application/rdf+xml');
              res.json(user);
            },

            'application/json': function () {
              res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
              res.set('Content-Type', 'application/json');
              res.json(user);
            },



              
             });

           };

            }
          }
  






//http request ou fetch

//request line- la methode http user- route sur laquelle on fait la request -version http - header :Body

//coté réponse:status line- version http - code reponse header- body


////////////////
//res.format({

//                'application/xml': function () {
 //                res.setHeader('Content-disposition', 'attachment; filename=score.xml'); //do nothing
 //                 res.set('Content-Type', 'application/xml');
 //                 res.json(user);
 //               },

 //               'application/xml': function () {
 //                 res.setHeader('Content-disposition', 'attachment; filename=score.xml'); //do nothing
 //                 res.set('Content-Type', 'application/xml');
 //                 res.json(user);
 //               },
//
 //               'application/json': function () {
 //                 res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
 //                 res.set('Content-Type', 'application/json');
 //                 res.json(user);
 //               },
                  
 //                });


//read json
//const readFilePromise = promisify(readFile);
//const writeFilePromise = promisify(writeFile);

//function to convert
//(async function convertJsonToXml() {
//  const staticSiteGeneratorData = JSON.parse(
 //   await readFilePromise("test_data.json", "utf8")
 // ) as [
 //   {
 //     num: int,
 //     code_commune: int,
 //     code_departement: int,
 //     code_region: int,
 //     description: string,
  //  }
  //];
  //console.log(staticSiteGeneratorData)


  //const xmlFormattedStaticSiteGeneratorData = [
  //{
  //  staticSiteGenerators: [
   //   ...staticSiteGeneratorData.map((item) => {
   //     return {
   //       staticSiteGenerator: [
   //         {
    //            _attr: {
    //              code_commune: item.code_commune,
    //               code_departement: item.code_departement,
    //               code_region : item.code_region,
    //               description: item.description,
     //           },
     //         },
     //         item.num,
     //         ],
      //      };
      //    }),
 //       ],
 //     },
 //   ];

  //console.log(xmlFormattedStaticSiteGeneratorData)



  //convert xml to json
  //const staticSiteGeneratorXmlString = xml(xmlFormattedStaticSiteGeneratorData);
  //console.log(staticSiteGeneratorXmlString)
  //await writeFilePromise("data.xml", staticSiteGeneratorXmlString, "utf8");



//})();


//read json
// let rawdata = fs.readFileSync('test_data.json')
//var testData = JSON.parse(rawdata)
//console.log(testData)

//app.get('/', function(req, res){
//  req.accepts(['json', 'xml']);   
 // req.accepts('rdf/xml');  

 //});

//  console.log('aaaaa')



//app.get('/', function(req, res){
//   res.format({ 
//   'xml': function(){  
//    res.set('Content-Type', 'application/xml');
//      res.send('xml'); 
//      res.xml(data); 
//      res.location(path)   ; 
//    },  
//    'application/json': function(){  
//      res.set('Content-Type', 'application/json');
//      res.send({ message: 'json' }); 
//      res.json(data); 
//      res.location(path)   ;
//    },  
//   'default': function() {  
      // log the request and respond with 406  
//      res.status(406).send('Not Acceptable');  
//    }  
//  });  

//   res.end()
// });


//vocab qu'on utilise dans notre rdf/xml




