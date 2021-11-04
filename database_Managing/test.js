const admin = require('firebase-admin');
const express = require('express');
var bodyParser = require('body-parser');

// Doc API : https://blog.cloudboost.io/adding-swagger-to-existing-node-js-project-92a6624b855b

const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("../swagger.json");
const app = express(); 
app.use(
    // https://blog.cloudboost.io/adding-swagger-to-existing-node-js-project-92a6624b855b
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


var serviceAccount = require("./credential.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const PORT = process.env.PORT || 3000 ;

// https://levelup.gitconnected.com/how-to-add-swagger-ui-to-existing-node-js-and-express-js-project-2c8bad9364ce

app.get("/", function(req, res){
    console.log(req.method)
    res.send("hey");

})

app.post("/", function(req, res){
    console.log(req.body)
    console.log(req.headers)
    res.send(req.body);
})

app.post('/test', function (req, res) {
    const {
        valeur,
        echelle
    } = req.body;
    let collection = "dataGouv_Grenoble"
    let cityRef = db.collection(collection);
    test = cityRef.where(echelle, '==', valeur).get()
    .then(querySnapshot => {
        let li = new Array();
        querySnapshot.docs.map(doc => { 
            li.push(doc.data())
        });
        res.json({
            "EveryPoint":li
        })
        return li
    }).catch(err => {
        console.log(err);
        res.sendStatus(404);
    })
    test.then(d => {
        console.log(d)
    })
});

app.listen(PORT, function () {
  console.log('Petits emprunts lancé sur le port :' + PORT);
});