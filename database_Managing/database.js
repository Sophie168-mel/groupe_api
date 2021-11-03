var admin = require("firebase-admin");
const geofire = require("geofire-common")
const dfd = require("danfojs-node");

var serviceAccount = require("./credential.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();



// json_data = [{A: 1, B: 2}, {A: 1, B: 2}]
// var df

// url = "https://data.mobilites-m.fr/api/points/json?types=autostop"

// fetch(url)
//   .then(res => res.json())
//   .then(json_data => {
//     df = new dfd.DataFrame(json_data["features"]);
//     console.log(df.head().print());
//   });


/*
df1 = df.iloc({rows: [":15"], columns: [":4"]})
console.log(df1.print())

dfd.read_csv("./database_Managing/data.csv")
.then(df => {
  console.log(df)
  df.head().print()
}).catch(err =>{
  console.log(err)
})
*/


// ############ ############ ############ ############ ############ ############
// ############ ############       Get list data       ############ ############
// ############ ############ ############ ############ ############ ############ 
function GetValueWhere(collection, echelle, valeur, limit=0){

  const cityRef = db.collection(collection);
  if (limit>0){
    var query = cityRef.where(echelle, '==', valeur)
  } else {
    var query = cityRef.where(echelle, '==', valeur).limit(limit)
  }
  query.get()
  .then(querySnapshot => {
   li = new Array();  
   querySnapshot.docs.map(doc => { li.push(doc.data()) });
   // res.send(li) pour le retour de l'api
   // =====> https://pretagteam.com/question/asyncawait-on-firebase-queries
   console.log(li) // Sorted value here !
  });
}

// ############ ############ ############ ############ ############ ############
// ############ ############       Get one data       ############ ############
// ############ ############ ############ ############ ############ ############ 
function getData(collection, id){

   const cityRef = db.collection(collection); //"dataGouv_Grenoble"
   cityRef.doc(id).get()
   .then(doc => {
      console.log(doc.data())
    });
}
// ############ ############ ############ ############ ############ ############
// ############ ############       Get count data       ############ ############
// ############ ############ ############ ############ ############ ############ 

function GetCountValue(collection, echelle, valeur){

  const cityRef = db.collection(collection);
  var query = cityRef.where(echelle, '==', valeur)
  query.get()
  .then(querySnapshot => {
    console.log(querySnapshot.size)
    // res.send(querySnapshot.size) pour le retour de l'api
    // =====> https://pretagteam.com/question/asyncawait-on-firebase-queries
  });
}
// ############ ############ ############ ############ ############ ############
// ############ ############       Post data       ############ ############
// ############ ############ ############ ############ ############ ############ 

function AddPoint(collection, data){
  const cityRef = db.collection(collection);
  cityRef.doc().set(data).then(()=> {
    console.log("Succes")
  }).catch(err=>{
    console.log(err)
  });
}

// ############ ############ ############ ############ ############ ############
// ############ ############       Update to geo data  ############ ############
// ############ ############ ############ ############ ############ ############ 

function updateData(collection){
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
// ############ ############       Resaerch in geo data  ############ ############
// ############ ############ ############ ############ ############ ############ 
function getArround(collection, center, rayon){
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
    li = Array()
    matchingDocs.map(doc => {
      li.push(doc.data());
    })
    console.log(li);
  });
}
  
  

// ############ ############ ############ ############ ############ ############
// ############ ############      Test geo data         ############ ############
// ############ ############ ############ ############ ############ ############ 


var test = false


if (test == true){
  collection = "dataGouv_Grenoble"
  updateData(collection)
  
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






//const hash = geohashForLocation([51.5074, 0.1278]);
// echelle = 'Nom territoire'
// valeur = "Grésivaudan"

// const cityRef = db.collection("dataGouv_Grenoble");
// cityRef.where(echelle, '==', valeur).get()
// .then(querySnapshot => {
//   li = new Array();  

//   querySnapshot.docs.map(doc => { li.push(doc.data()) });
  
//   // res.send(li) pour le retour de l'api
//   // =====> https://pretagteam.com/question/asyncawait-on-firebase-queries
  
//   console.log(li)
// });
