"use strict";
const express = require('express');
const dfd = require("danfojs-node");

// Module ajouter pour effectuer les requetes à la base de donnée
const database = require("./database.js");
const app = express();
const PORT = process.env.PORT || 3000 ;
const collection = "dataGouv_Grenoble"


// Middleware
app.use(express.json());

// Création des routes
app.get('/parkings', function (req, res) {
    res.status(200).json(parkings);
});


app.get('/pouces', function(req, res){
	var zoom = req.query.zoom;
	var value = req.query.value.toString();
	if ((zoom == "code_departement" | zoom == "ID territoire" | zoom == "code_region")) 
	{
	   //readCSV(res,zoom,value);
     var center = [45.140195, 5.673187];
     var rayon = 50 // en km
     database.getArround(res, collection, center, rayon)
     //database.GetValueWhere(res, collection, db, zoom, value)
  }
	else {
	  res.send("Variable zoom non definie et\/ou non valorisée dans l\'URL. Valeurs possibles: code_commune ou code_departement ou code_region");
	}
});

app.listen(PORT, function () {
  console.log('Serveur lancé sur le port :' + PORT);
});
