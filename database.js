const geofire = require("geofire-common");
const admin = require("firebase-admin");
const js2rdf = require("./tool/json_to_rdf")
const js2xml = require("./tool/json_to_xml")
var serviceAccount = require("./credential.json");

// Connexion à la base de donnée
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// ############ ############ ############ ############ ############ ############
// ############ ############      Add file data         ############ ############
// ############ ############ ############ ############ ############ ############ 

function updateDatabase(){
  const dfd = require("danfojs");
  dfd.read_csv("./data.csv") //assumes file is in CWD
  .then(df => {
  
    df.head().print()
    let collection = "dataPoint"
    for(d in df){
      const cityRef = db.collection(collection);
      cityRef.doc().set(d).then(()=> {
        console.log("SUCCESS")
      }).catch(err=>{
        console.log("ERROR: DATA NOT SEND");
      });
    } 
  }).catch(err=>{
     console.log(err);
  })

  
}

//updateDatabase()

// ############ ############ ############ ############ ############ ############
// ############ ############       Get list data       ############ ############
// ############ ############ ############ ############ ############ ############ 

exports.GetValueWhere = function (res, collection, echelle, valeur, limit=0){

  const cityRef = db.collection(collection);
  if (limit == 0){
    var query = cityRef.where(echelle, '==', valeur)
  } else {
    var query = cityRef.where(echelle, '==', valeur).limit(limit)
  }
  query.get()
  .then(querySnapshot => {
    let li = new Array();  
    querySnapshot.docs.map(doc => { li.push(doc.data()) });
    returnFormat(res, li)
  }).catch(err =>{
    res.status(404).send("ERROR: NO DATA");
  })
}

// ############ ############ ############ ############ ############ ############
// ############ ############       Get one data       ############ ############
// ############ ############ ############ ############ ############ ############ 

exports.getData = function (res, collection, id){

   const cityRef = db.collection(collection); //"dataGouv_Grenoble"
   cityRef.doc(id).get()
   .then(doc => {
      returnFormat(res, doc.data())
    }).catch(err=>{
      res.status(404).send("ERROR: NO DATA");
    })
}

// ############ ############ ############ ############ ############ ############
// ############ ############       Get count data       ############ ############
// ############ ############ ############ ############ ############ ############ 

exports.GetCountValue = function (res, collection, echelle, valeur){
  const cityRef = db.collection(collection);
  var query = cityRef.where(echelle, '==', valeur)
  query.get()
  .then(querySnapshot => {
    returnFormat(res, querySnapshot.size);
  }).catch(err=>{
    res.status(404)
  })
}

// ############ ############ ############ ############ ############ ############
// ############ ############       Post data       ############ ############
// ############ ############ ############ ############ ############ ############ 

exports.AddPoint = function (res, collection, data){
  const cityRef = db.collection(collection);
  cityRef.doc().set(data).then(()=> {
    returnFormat(res, "SUCCESS");
  }).catch(err=>{
    res.status(404).send("ERROR: DATA NOT SEND");
  });
}

// ############ ############ ############ ############ ############ ############
// ############ ############       Research in geo data  ############ ############
// ############ ############ ############ ############ ############ ############ 

exports.getArround = function (res, collection, center, rayon){
  var radiusInM = rayon * 1000;
  var bounds = geofire.geohashQueryBounds(center, radiusInM);
  var promises = [];
  for (const b of bounds) {
    const q = db.collection(collection)
    .orderBy('geohash')
    .startAt(b[0])
    .endAt(b[1]);
    promises.push(q.get());
  }
  
  Promise.all(promises).then((snapshots) => {
    const matchingDocs = [];
    
    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get('Latitude');
        const lng = doc.get('Longitude');
        if(lat != undefined & lng != undefined){
          const distanceInKm = geofire.distanceBetween([parseFloat(lat), parseFloat(lng)], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            matchingDocs.push(doc);
          }
        }
      }
    }
    
    return matchingDocs;
  }).then((matchingDocs) => {
    let li = Array()
    matchingDocs.map(doc => {
      li.push(doc.data());
    })
    returnFormat(res, li);
  }).catch(err=>{
    res.status(404).send("ERROR: NO DATA");
  });
}

// ############ ############ ############ ############ ############ ############
// ############ ############  Tool:Update to geo data  ############ ############
// ############ ############ ############ ############ ############ ############ 

function updateToGeoData(collection){
  /**
   * Update value of API, with geohash for geo request.
   * Value:
   *  coollection - str : Name of collection concerned
   * Return: Nothing
   */
  var cityRef = db.collection(collection);
  cityRef.get()
  .then(querySnapshot => {
    querySnapshot.docs.map(doc => { 
      let d = doc.data()
      let target = doc.id
      let hash = geofire.geohashForLocation([parseFloat(d["Latitude"]), parseFloat(d["Longitude"])]);
      cityRef.doc(target).update({
        geohash: hash,
      }).then(() => {
        console.log("Success")
      }).catch(err => {
        console.log(err)
      })
    });
  })
}

// ############ ############ ############ ############ ############ ############
// ############ ############  Tool: Adapt to format    ############ ############
// ############ ############ ############ ############ ############ ############ 

function returnFormat(res, val){
  if (val == "SUCCESS" ){
    res.status(200).send("OK");
  } else {
    let msg;
    let isCompute = false;
    if (typeof val != "object"){
      msg = {"resultat":val};
      isCompute = true;
    } else if (Array.isArray(val) != true){
      msg = [val];
    } else {
      msg = val;
    }
    // FIX BUG: => XML/RDF pour la route : localhost:3000/map/count?echelle=Nom territoire&value=Grésivaudan
    res.format({
      'application/xml': function () {
        res.status(200).send(js2xml.json_to_xml(msg, isCompute))
      },
      
      'application/json': function () {
        res.status(200).send(msg)
      },
      
      'application/rdf': function () {
          if(isCompute){
            res.status(200).send(js2xml.json_to_xml(msg, isCompute))
          } else {
            res.status(200).send(js2rdf.json_to_rdf(msg))
          }
      },
      default: function () {
        // log the request and respond with 406
        res.status(406).send('ERROR: BAD FORMAT')
      }
    })
  } 
}


// ############ ############ ############ ############ ############ ############
// ############ ############      Test geo data         ############ ############
// ############ ############ ############ ############ ############ ############ 
var test = false;

if (test == true){

  // Tester sans la valeur res de express js.
  function res(){}
  res.prototype.send = function(val){
    console.log(val)
  }
  var x = new res()
  x.send("hello")

  collection = "dataGouv_Grenoble"
  updateToGeoData(res, collection)
  
  id = "1861" // en str uniquement !
  getData(res, collection, id)
  
  data = {
    "Latitude":"45.271714",
    "Longitude":"5.271714",
    "ID territoire":"28"
  }
  AddPoint(res, collection, data)
  
  
  echelle = 'Nom territoire'
  valeur = "Grésivaudan"
  GetValueWhere(res, collection, echelle, valeur, limit=0)
  GetCountValue(res, collection, echelle, valeur)
  
  var center = [45.140195, 5.673187];
  var rayon = 50 // en km
  getArround(res, collection, center, rayon)
}