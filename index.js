"use strict";
const express = require("express");

// Module ajouter pour effectuer les requetes à la base de donnée
const database = require("./database.js");
const app = express();
const PORT = process.env.PORT || 3000;
const collection = "dataGouv_Grenoble";

// Middleware
app.use(express.json());

function IsRequestHeaderAcceptValid(req) {
  if (req.accepts(["application/json", "application/xml", "application/rdf"])) {
    return 1;
  } else {
    return 0;
  }
}

app.post("/pouce", function (req, res) {
  // OK
  if (IsRequestHeaderAcceptValid(req)) {
    var body = req.body;

    if (
      body.hasOwnProperty("Latitude") &
      body.hasOwnProperty("Longitude") &
      body.hasOwnProperty("ID territoire")
    ) {
      database.AddPoint(res, collection, body);
    } else
      res
        .status(400)
        .send(
          "Latitude ou Longitude ou ID territoire absente des données JSON"
        );
  } else {
    res.status(406).send("Header Accept not acceptable");
  }
});

app.get("/pouces", function (req, res) { // OK
  if (IsRequestHeaderAcceptValid(req)) {
    if ((req.query.echelle == undefined) | (req.query.value == undefined)) {
      message = "Les variables echelle et value ne sont pas définies";
      res.status(406).send("ERROR:" + message);
    } else {
      var echelle = req.query.echelle.toString();
      var value = req.query.value.toString();
      if (req.query.hasOwnProperty("limit") & !isNaN(req.query.limit)) {
		let limit = parseInt(req.query.limit);
        database.GetValueWhere(res, collection, echelle, value, limit);
      } else {
        database.GetValueWhere(res, collection, echelle, value);
      }
    }
  } else {
    res.status(406).send("Header Accept not acceptable");
  }
});

app.get("/map", function (req, res) { // OK
  if (IsRequestHeaderAcceptValid(req)) {
    if ((req.query.rayon == undefined) | (req.query.center == undefined)) {
      message = "les variables rayon et center ne sont pas définies";
      res.status(406).send("ERROR:" + message);
    } else {
      var center = req.query.center.toString().split(",");
      var rayon = parseFloat(req.query.rayon.toString());
      var centerArr = center.map(Number);
      var message = "";

      if (!Array.isArray(centerArr) | (centerArr.length != 2)) {
        message =
          "Variable centre n'est pas bien définie, exemple : 45.140195,5.673187";
        res.status(406).send("ERROR:" + message);
      } else if (rayon < 1) {
        message = "Le rayon est inférieur à 1 km";
        res.status(406).send("ERROR:" + message);
      } else {
        database.getArround(res, collection, centerArr, rayon);
      }
    }
  } else {
    res.status(406).send("Header Accept not acceptable");
  }
});

app.get("/map/count", function (req, res) { // OK
  if (IsRequestHeaderAcceptValid(req)) {
    if ((req.query.echelle == undefined) | (req.query.value == undefined)) {
      message = "les variables echelle et value ne sont pas définies";
      res.status(406).send("ERROR:" + message);
    } else {
      var echelle = req.query.echelle.toString();
      var value = req.query.value.toString();
      database.GetCountValue(res, collection, echelle, value);
    }
  } else {
    res.status(406).send("Header Accept not acceptable");
  }
});

app.get("/map/data", function (req, res) {
  // OK
  if (IsRequestHeaderAcceptValid(req)) {
    if (req.query.id.toString() == undefined) {
      message = "la variable id n'est pas définie";
      res.status(406).send("ERROR:" + message);
    } else {
      var id = req.query.id.toString();

      if (parseInt(id) % 1 != 0) {
        message = "id is not valid";
        res.status(406).send("ERROR:" + message);
      } else {
        database.getData(res, collection, id);
      }
    }
  } else {
    res.status(406).send("Header Accept not acceptable");
  }
});

app.listen(PORT, function () {
  console.log("Serveur lancé sur le port :" + PORT);
});
