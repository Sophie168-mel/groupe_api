"use strict";
const express = require("express");
const swaggerUi = require("swagger-ui-express"),
const swaggerDocument = require("./swagger.json");
const database = require("./database.js");
const Ajv = require("ajv");

// Module ajouter pour effectuer les requetes à la base de donnée
const app = express();
const PORT = process.env.PORT || 3000;
const collection = "DataBase";

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );

// Middleware
app.use(express.json());

function IsRequestHeaderAcceptValid(req) {
  if (req.accepts(["application/json", "application/xml", "application/rdf+xml"])) {
    return 1;
  } else {
    return 0;
  }
}

function IsJsonRequestBody(res,data) {
   const ajv = new Ajv({allErrors: true});
   const schema = {
    type: "object",
    properties: {
                    "latitude": {type: "string"},
                    "longitude": {type: "string"},
                    "commentaire": {type: "string"}
                },
    required: ["latitude","longitude","commentaire"],
    additionalProperties: false
    };
   const valid = ajv.validate(schema, data);
   if (!valid) return ajv.errors;
   else return true; 
} 

app.post("/pouce", function (req, res) { // OK
  if (IsRequestHeaderAcceptValid(req)) {
    let body = req.body;
    let configInputData = IsJsonRequestBody(res,data);
    if ( IsJsonRequestBody(res,body) == true ) {
      database.AddPoint(res, collection, body);
    } else
      res
        .status(400)
        .send(configInputData);
  } else {
    res.status(406).send("ERROR: Header not acceptable");
  }
});

app.get("/pouces", function (req, res) { // OK
  if (IsRequestHeaderAcceptValid(req)) {
    if ((req.query.echelle == undefined) | (req.query.value == undefined)) {
      let message = "No defined values (echelle, value)";
      res.status(406).send("ERROR:" + message);
    } else {
      let echelle = req.query.echelle.toString();
      let value = req.query.value.toString();
      if (req.query.hasOwnProperty("limit") & !isNaN(req.query.limit)) {
		let limit = parseInt(req.query.limit);
        database.GetValueWhere(res, collection, echelle, value, limit);
      } else {
        database.GetValueWhere(res, collection, echelle, value);
      }
    }
  } else {
    res.status(406).send("ERROR: Header not acceptable");
  }
});


/*Description :

Retourne tous les points gps des arrets d'autostop dans un rayon donné
GET => route: map exemple "http://localhost:3000/map"

Paramètres: 
- centre: str exemple 45.140195,5.673187
- rayon: str exemple 50 (en km);*/

app.get("/map", function (req, res) { // OK
  if (IsRequestHeaderAcceptValid(req)) {
	
    if ((req.query.rayon == undefined) | (req.query.center == undefined)) {
       let message = "No defined values (center, rayon)";
      res.status(406).send("ERROR:" + message);
    } else {
      let center = req.query.center.toString().split(",");
      let rayon = parseFloat(req.query.rayon.toString());
      let centerArr = center.map(Number);

      if (!Array.isArray(centerArr) | (centerArr.length != 2)) {
        message =  "Bad value center, example : 45.140195,5.673187";
        res.status(406).send("ERROR:" + message);
      } else if (rayon < 1) {
        message = "Rayon less 1 km";
        res.status(406).send("ERROR:" + message);
      } else {
        database.getArround(res, collection, centerArr, rayon);
      }
    }
  } else {
    res.status(406).send("ERROR: Header not acceptable");
  }
});


/*Description :

retourne le nombre de points gps d'arrets d'autostop d'une echelle donnée
GET => route: map/count exemple "http://localhost:3000/map/count"

Parametre: 
- echelle: str exemple  'Nom territoire'
- valeur: str exemple "Grésivaudan" */

app.get("/map/count", function (req, res) { // OK
  if (IsRequestHeaderAcceptValid(req)) {
	 
    if ((req.query.echelle == undefined) | (req.query.value == undefined)) {
      let message = "No defined values (echelle, value)";
      res.status(406).send("ERROR:" + message);
    } else {
      let echelle = req.query.echelle.toString();
      let value = req.query.value.toString();
      database.GetCountValue(res, collection, echelle, value);
    }
  } else {
    res.status(406).send("ERROR: Header not acceptable");
  }
});


/*Description :

retourne le nombre de points gps d'arrets d'autostop à partir d'un identifiant donné
GET => route: map/data exemple "http://localhost:3000/map/data"

Paramètre: 
- id: str exemple  '1861'
 */
app.get("/map/data", function (req, res) {
  // OK
  if (IsRequestHeaderAcceptValid(req)) {
	 
    if (req.query.id == undefined) {
      let message = "No defined value";
      res.status(406).send("ERROR:" + message);
    } else {
      let id = req.query.id.toString();
      if (parseInt(id) % 1 != 0) {
        message = "ID is not int";
        res.status(406).send("ERROR:" + message);
      } else {
        database.getData(res, collection, id);
      }
    }
  } else {
    res.status(406).send("ERROR: Header not acceptable");
  }
});

app.get("*", function(req, res){
    res.status(200).send("Doc: <a href='/api-docs'>Link</a>")
})

app.listen(PORT, function () {
  console.log("Serveur lancé sur le port :" + PORT);
});
