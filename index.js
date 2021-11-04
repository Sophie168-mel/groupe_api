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
	if (req.accepts(['application/json','application/xml','application/rdf']))
        {
                 return 1;
        }
	else
	{
                 return 0;
        }
}

app.get('/map', function(req, res){
    if (IsRequestHeaderAcceptValid(req)) 
    {
        var center = req.query.center.toString().split(",");
        var rayon = parseFloat(req.query.rayon.toString());
        var centerArr=center.map(Number);
        var message=""
        if(!Array.isArray(centerArr) | centerArr.length != 2){
            message = "Variable centre n'est pas bien définie, exemple : 45.140195,5.673187"
            res.status(406).send("ERROR:"+message)
        }
        else if(rayon < 1){
            message = "Le rayon est inférieur à 1 km"
            res.status(406).send("ERROR:"+message)
        }
        else {
            database.getArround(res, collection, centerArr, rayon)
        }
    } else {
        res.status(406).send("Header Accept not acceptable");
    }

});

app.listen(PORT, function () {
  console.log('Serveur lancé sur le port :' + PORT);
});
