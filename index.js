"use strict";
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000 ;
const parkings = require('./parkings.json');
const fs       = require('fs');

// Middleware
app.use(express.json());

// Création des routes
app.get('/parkings', function (req, res) {
    res.status(200).json(parkings);
});

//sends html, JSON or CSV depending on content negociation
app.get('/score', function(req, res) {
	res.format({
            'application/json': function () {
              				    res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
              				    res.set('Content-Type', 'application/json');
              				    res.send("JSON demandé");
	     				    },
            'application/xml':  function () {
                                            res.setHeader('Content-disposition', 'attachment; filename=score.xml'); //do nothing
                                            res.set('Content-Type', 'application/xml');
                                            res.send("XML demandé");
                                            }
	    "application/rdf+xml" : function () 
		                            {
					    res.setHeader('Content-disposition', 'attachment; filename=score.xml'); //do nothing
                                            res.set('Content-Type', 'application/rdf+xml');
                                            res.send("RDF+XML demandé");
		    			    }
            'default'        : function ()  {
		    			    res.status(406).send("Not acceptable")
                                            })
});

// Définition de la route GET qui récupère l'ensemble des parkings dans nos données:  
app.get('/parkings/:id', function (req,res) {
    const id = parseInt(req.params.id);
    const OutputTypeFile = req.headers; 

    if (OutputTypeFile) 
    {
    	// do normal stuff
    	const parking = parkings.find(parking => parking.id === id);
    	res.status(200).json(OutputTypeFile); // parking
    } 
    else
    {
	res.status(1024).send("Variable OutputTypeFile non définie!"); //.json(parkings)
    }
});

// Route POST /parkings pour pouvoir créer un nouveau parking.
app.post('/parkings', function (req,res) {
    parkings.push(req.body);
    fs.writeFile('./parkings.json', JSON.stringify(parkings), 'utf8', function (err) { 
	    								 	  	if (err)
		    										return res.status(500).send("Erreur d ecriture fichier json");
  												// Successfully wrote to the file!
	     											res.status(201).send("Insertion OK"); //.json(parkings)
    											});
});


// Route PUT /parkings/:id pour pouvoir modifier un parking.
// Pour modifier un document dans une Node JS API, les méthodes PUT ou PATCH sont à privilégier. 
// Une requête PUT va modifier l'intégralité du document par les valeurs du nouvel arrivant. 
// Une requête PATCH va uniquement mettre à jour certains champs du document.

app.put('/parkings/:id', function (req,res) {
    const id = parseInt(req.params.id);
    let parking = parkings.find(parking => parking.id === id)
    parking.name =req.body.name,
    parking.city =req.body.city,
    parking.type =req.body.type,
    res.status(200).json(parking)
});

// Route DELETE /parkings permet d'effacer un élément de la ressource grâce à votre Node JS API
app.delete('/parkings/:id', function (req,res) {
    const id = parseInt(req.params.id)
    let parking = parkings.find(parking => parking.id === id)
    parkings.splice(parkings.indexOf(parking),1)
    res.status(200).json(parkings)
});

app.listen(PORT, function () {
  console.log('Serveur lancé sur le port :' + PORT);
});
