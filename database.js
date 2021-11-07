const geofire = require("geofire-common");
const admin = require("firebase-admin");
const js2rdf = require("./tool/json_to_rdf")
const js2xml = require("./tool/json_to_xml")

// Connexion à la base de donnée
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: process.env.project_id,
    client_email: process.env.client_email,
    private_key: process.env.private_key.replace(/\\n/g, '\n'),
    })
});

const db = admin.firestore();

// ############ ############ ############ ############ ############ ############
// ############ ############      Tool file data       ############ ############
// ############ ############ ############ ############ ############ ############ 

function updateDatabase(){
  const dfd = require("danfojs");
  dfd.read_csv("./data.csv") //assumes file is in CWD
  .then(df => {
    df.head().print()
    let collection = "dataPoint"
    for(d in df){
      let cityRef = db.collection(collection);
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

   let cityRef = db.collection(collection); //"dataGouv_Grenoble"
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
  let cityRef = db.collection(collection);
  let query = cityRef.where(echelle, '==', valeur)
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
  let cityRef = db.collection(collection);
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
  let radiusInM = rayon * 1000;
  let bounds = geofire.geohashQueryBounds(center, radiusInM);
  let promises = [];
  for (const b of bounds) {
    let q = db.collection(collection)
    .orderBy('geohash')
    .startAt(b[0])
    .endAt(b[1]);
    promises.push(q.get());
  }
  
  Promise.all(promises).then((snapshots) => {
    let matchingDocs = [];
    
    for (let snap of snapshots) {
      for (let doc of snap.docs) {
        let lat = doc.get('latitude');
        let lng = doc.get('longitude');
        if(lat != undefined & lng != undefined){
          let distanceInKm = geofire.distanceBetween([parseFloat(lat), parseFloat(lng)], center);
          let distanceInM = distanceInKm * 1000;
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
  let cityRef = db.collection(collection);
  cityRef.get()
  .then(querySnapshot => {
    querySnapshot.docs.map(doc => { 
      let d = doc.data()
      let target = doc.id
      let hash = geofire.geohashForLocation([parseFloat(d["latitude"]), parseFloat(d["longitude"])]);
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
      msg.forEach(function(v){ delete v.geohash });
    } else {
      msg = val;
      msg.forEach(function(v){ delete v.geohash });
    }
    res.format({
      'application/xml': function () {
        res.status(200).send(js2xml.json_to_xml(msg, isCompute))
      },
      
      'application/json': function () {
        res.status(200).send(msg)
      },
      
      'application/rdf+xml': function () {
        res.status(200).send(js2rdf.json_to_rdf(msg, isCompute))
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
  let x = new res()
  x.send("hello")

  collection = "dataBase"
  updateToGeoData(res, collection)
  
  id = "1861" // en str uniquement !
  getData(res, collection, id)
  
  data = {
    "latitude":"45.271714",
    "longitude":"5.271714",
    "commentaire":"28"
  }
  AddPoint(res, collection, data)
  
  
  echelle = 'code_departement'
  value = "73" // Savoie in my heart !
  GetValueWhere(res, collection, echelle, value, limit=0)
  GetCountValue(res, collection, echelle, value)
  
  let center = [45.140195, 5.673187];
  let rayon = 50 // en km
  getArround(res, collection, center, rayon)
}