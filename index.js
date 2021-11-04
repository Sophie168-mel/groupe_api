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

function IsRequestHeaderAcceptValid(req) {
	if (req.accepts(['application/json','application/xml','application/rdf\+xml']))
        {
                 return 1;
        }
	else
	{
                 return 0;
        }
}

app.get('/pouces', function(req, res){
	if (IsRequestHeaderAcceptValid(req)) 
	{
		var zoom = req.query.zoom;
		var value = req.query.value.toString();
		if ((zoom == "code_departement" | zoom == "ID territoire" | zoom == "code_region")) 
		{
     			var center = [45.140195, 5.673187];
     			var rayon = 50 // en km
     			database.getArround(res, collection, center, rayon)
     			//database.GetValueWhere(res, collection, db, zoom, value)
  		}
		else {
	  		res.send("Variable zoom non definie et\/ou non valorisée dans l\'URL. Valeurs possibles: code_commune ou code_departement ou code_region");
		}
	}
	else
	{
       		 res.status(406).send("Header Accept not acceptable");
        }

});

app.post('/pouce', function(req, res) {
        if (IsRequestHeaderAcceptValid(req))
        {
			var body = req.body;

			if (body.hasOwnProperty('Latitude') & body.hasOwnProperty('Longitude') & body.hasOwnProperty('ID territoire')) 
			{
				database.AddPoint(res,collection, body);
                        	//res.status(201).send("Insertion OK");

			}
			else
				res.status(400).send("Latitude ou Longitude ou ID territoire absente des données JSON");
        }
        else
        {
                 res.status(406).send("Header Accept not acceptable");
        }

});

app.listen(PORT, function () {
  console.log('Serveur lancé sur le port :' + PORT);
});
