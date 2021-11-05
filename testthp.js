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
		//var value = req.query.value.toString();
		if ((zoom == "code_departement" | zoom == "ID territoire" | zoom == "code_region")) 
		{
     			var echelle = 'Nom territoire'
  			var valeur = "Grésivaudan"
     			database.GetValueWhere(res, collection, echelle, valeur)
  		}
		else {
	  		res.status(406).send("Variable echelle non definie et\/ou non valorisée dans l\'URL. Valeurs possibles: 'Nom territoire'");
		}
	}
	else
	{
       		 res.status(406).send("Header Accept not acceptable");
        }

});

function IsJsonRequestBody(res,data)
{
	const Ajv = require("ajv");
	const ajv = new Ajv({allErrors: true});
        const schema = {
                        type: "object",
                        properties: {
                                        "Latitude": {type: "string"},
                                        "Longitude": {type: "string"},
                                        "ID territoire": {type: "string"}
                                    },
                        required: ["Latitude","Longitude","ID territoire"],
                        additionalProperties: false
                        };

        const valid = ajv.validate(schema, data);
        if (!valid) 
		return ajv.errors;
        else
                return null; //res.send("no errorrs");

}

app.post('/pouce', function(req, res) {
        if (IsRequestHeaderAcceptValid(req))
        {
			var body = req.body;
			var valid = IsJsonRequestBody(res,body);
        		
			if (valid == null)
			{
				database.AddPoint(res,collection, body);
                        	//res.status(201).send("Insertion OK");

			}
			else
				res.status(400).send(valid);
        }
        else
        {
                 res.status(406).send("Header Accept not acceptable");
        }

});

app.listen(PORT, function () {
  console.log('Serveur lancé sur le port :' + PORT);
});
