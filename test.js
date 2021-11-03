'use strict';

// application requires using express module so before ,install npm insytall  express-save

  
//varaible that permits to use the express module: required installation npm install express--save 

var express = require('express'); 

//variable for module csv: required installation npm install csv-express
//var csv = require('csv-express')


//var fetchUrl = require("fetch").fetchUrl
//var cheerio = require('cheerio')
//var cors = require('cors')
const fs = require('fs')
const querystring = require('querystring');





// definition of server parameters

var hostname = 'localhost'; 

var port = 3000; 


// create a express object. 

var app = express(); 

//app.use(cors())

// In order to facilate routage, we create an objet called Router that implements methods.
 

var myRouter = express.Router(); 

 
//a main road

myRouter.route('/')

// all permet de prendre en charge toutes les méthodes. 

.all(function(req,res){ 

      res.json({message : "Welcome to our test api project ", methode : req.method});

});


app.get('/', function (req, res) {
    res.send('<b>Hello</b> welcome to my http server made with express');
  })



// creation second road  test



// implements methods GET, POST, PUT, UPDATE et DELETE


//return one stop road
// GET
//http://localhost:3000/test/deux?echelle=2&limit=1&valeur=5
app.get('/test/deux', function(req, res){


		let points=[]

		let scale=["commune","departement","region"]

 		var echelle= req.query.echelle
    	var valeur = req.query.valeur
    	var limit = req.query.limit

    	var reg='"'+scale[2].toString()+'"'
		var dept='"'+scale[1].toString()+'"'
		var com='"'+scale[0].toString()+'"'

    	
    	
   		let elt=querystring.parse(echelle)
 
	    let rawdata = fs.readFileSync('test.json')
		var testData = JSON.parse(rawdata)
	
		//console.log(echelle)
		
		if(valeur == undefined){
			res.send({message : "error404", methode : "value is not defined"})
		}
		else{

		if(echelle.toString() == reg ){
			if(limit!= undefined){
			//region
			points = testData.slice(0, limit).filter(function (elt) {
  			 	return elt.code_region == valeur.toString();

					})
			}
			else{

				points = testData.filter(function (elt) {
			
  			 	return elt.code_region == valeur.toString();

					})

			}

		}
		if(echelle.toString() == dept) {
			if(limit != undefined){
			//departement
			points = testData.slice(0, limit).filter(function (elt) {
  					return elt.code_departement == valeur.toString();
					})
			}
			else{

				//departement
				points = testData.filter(function (elt) {
  					return elt.code_departement == valeur.toString();
					})

			}

		}
		if(echelle.toString() == com ){
			if(limit != undefined){
			//commune
			points = testData.slice(0, limit).filter(function (elt) {
  				return elt.code_commune == valeur.toString();
					})
			}
			else{

				//commune
			points = testData.filter(function (elt) {
  					return elt.code_commune == valeur.toString();
			})

			}

		}
	
		
		console.log(points)
		res.send(points)
		
		}
			
	}
);
myRouter.route('/test')

.get(function(req,res){ 

      res.json({message : "test", methode : req.method});

})

//POST

.post(function(req,res){

      res.json({message : "test", methode : req.method});

})

//PUT

.put(function(req,res){ 

      res.json({message : "test", methode : req.method});

})

//DELETE

.delete(function(req,res){ 

res.json({message : "test", methode : req.method});  

})


// ask application to use myRouter 

app.use(myRouter);  



// loading server 


app.listen(port, function () {
    console.log(`deploy on PORT : ${port}`)
});






