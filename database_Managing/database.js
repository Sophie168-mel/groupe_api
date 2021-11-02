var admin = require("firebase-admin");
// const fetch = require('node-fetch');
// const dfd = require("danfojs");

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
dfd.read_csv()
.then(df => {
}).catch(err =>{
  console.log()
})
*/


// ############ ############ ############ ############ ############ ############
// ############ ############       Get list data       ############ ############
// ############ ############ ############ ############ ############ ############ 
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

// ############ ############ ############ ############ ############ ############
// ############ ############       Get one data       ############ ############
// ############ ############ ############ ############ ############ ############ 
// id = "1861" // en str uniquement !

// const cityRef = db.collection("dataGouv_Grenoble");
// cityRef.doc(id).get()
// .then(doc => {
//   //   // res.send(li) pour le retour de l'api
//   console.log(doc.data())
// });

// ############ ############ ############ ############ ############ ############
// ############ ############       Get count data       ############ ############
// ############ ############ ############ ############ ############ ############ 
// echelle = 'Nom territoire'
// valeur = "Grésivaudan"

// const cityRef = db.collection("dataGouv_Grenoble");
// cityRef.where(echelle, '==', valeur).get()
// .then(querySnapshot => {
//   console.log(querySnapshot.size)
//   // res.send(querySnapshot.size) pour le retour de l'api
//   // =====> https://pretagteam.com/question/asyncawait-on-firebase-queries
// });

// ############ ############ ############ ############ ############ ############
// ############ ############       Post data       ############ ############
// ############ ############ ############ ############ ############ ############ 
// data = {
//   "Latitude":"45.271714",
//   "Longitude":"5.271714",
//   "ID territoire":"28",
// }

// const cityRef = db.collection("dataGouv_Grenoble");
// cityRef.doc().set(data);