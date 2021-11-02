var admin = require("firebase-admin");
const dfd = require("danfojs-node")

var serviceAccount = require("./credential.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


const data = {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA'
  };
  
  // Add a new document in collection "cities" with ID 'LA'
// let setDoc = db.collection('cities').doc('LA').set(data);

var csv = require('jquery-csv');

json_data = [{A: 1, B: 2}, {A: 1, B: 2}]
//df = new dfd.DataFrame(json_data)

dfd.read_csv("/home/etudiant-m2/Documents/OpenData/groupe_api/database_Managing/data.csv")
.then(df => {
    df.head().print()
}).catch(err =>{
    
})
