// application requires using express module so before ,install npm insytall  express-save

  
//varaible that permits to use the express module

var express = require('express'); 

// definition of server parameters

var hostname = 'localhost'; 

var port = 3000; 


// create a express object. 

var app = express(); 

// In order to facilate routage, we create an objet called Router that implements methods.
 

var myRouter = express.Router(); 

 

// creation a first road  test

myRouter.route('/test')

// implements methods GET, POST, PUT, UPDATE et DELETE

// GET

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

}); 


// ask application to use myRouter 

app.use(myRouter);  

 

// loading server 

app.listen(port, hostname, function(){

    console.log("My server starts on ://"+ hostname +":"+port); 

});

myRouter.route('/')

// all permet de prendre en charge toutes les méthodes. 

.all(function(req,res){ 

      res.json({message : "Welcome to our test api project ", methode : req.method});

});







