const geofire = require("geofire-common");
const admin = require("firebase-admin");
var serviceAccount = require("./credential.json");

// Connexion à la base de donnée
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// ############ ############ ############ ############ ############ ############
// ############ ############       Get list data       ############ ############
// ############ ############ ############ ############ ############ ############ 

exports.GetValueWhere = function (res, collection, echelle, valeur, limit=0){

  const cityRef = db.collection(collection);
  if (limit>0){
    var query = cityRef.where(echelle, '==', valeur)
  } else {
    var query = cityRef.where(echelle, '==', valeur).limit(limit)
  }
  query.get()
  .then(querySnapshot => {
    let li = new Array();  
    querySnapshot.docs.map(doc => { li.push(doc.data()) });
    res.status(200).json({"Liste de valeur":li}) 
  }).catch(err =>{
    res.status(404)
  })
}

// ############ ############ ############ ############ ############ ############
// ############ ############       Get one data       ############ ############
// ############ ############ ############ ############ ############ ############ 

exports.getData = function (res, collection, id){

   const cityRef = db.collection(collection); //"dataGouv_Grenoble"
   cityRef.doc(id).get()
   .then(doc => {
     res.status(200).json(doc.data())
    }).catch(err=>{
      res.status(404)
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
    res.status(200).send(querySnapshot.size)
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
    res.send(200)
  }).catch(err=>{
    res.send(404)
  });
}

// ############ ############ ############ ############ ############ ############
// ############ ############       Research in geo data  ############ ############
// ############ ############ ############ ############ ############ ############ 

exports.getArround = function getArround(res, collection, center, rayon){
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
          const distanceInKm = geofire.distanceBetween([parseInt(lat), parseInt(lng)], center);
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
    res.status(200).json({"Liste of li": li});
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
      let hash = geofire.geohashForLocation([parseInt(d["Latitude"]), parseInt(d["Longitude"])]);
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
// ############ ############      Test geo data         ############ ############
// ############ ############ ############ ############ ############ ############ 


var test = false;

if (test == true){
  const collection = "dataGouv_Grenoble"

  collection = "dataGouv_Grenoble"
  updateToGeoData(collection)
  
  id = "1861" // en str uniquement !
  getData(collection, id)
  
  
  data = {
    "Latitude":"45.271714",
    "Longitude":"5.271714",
    "ID territoire":"28",
  }
  AddPoint(collection, data)
  
  
  echelle = 'Nom territoire'
  valeur = "Grésivaudan"
  GetValueWhere(collection, echelle, valeur, limit=0)
  GetCountValue(collection, echelle, valeur)
  
  var center = [45.140195, 5.673187];
  var rayon = 50 // en km
  getArround(collection, center, rayon)
}