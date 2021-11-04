app.get('/map', function(req, res){
    if (IsRequestHeaderAcceptValid(req)) 
    {

        if(req.query.rayon == undefined | req.query.center == undefined){
             message = "les variables rayon et center ne sont pas définies"
            res.status(406).send("ERROR:"+message)

        }
        else{
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
        } 
}
    else {
        res.status(406).send("Header Accept not acceptable");
    }

    

});



app.get("/map/count", function (req, res) {
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


app.get('/map/data', function(req, res){
    if (IsRequestHeaderAcceptValid(req)) 
    {
        
        if(req.query.id.toString() == undefined) {
      
        message = "la variable id n'est pas définie";
        res.status(406).send("ERROR:" + message);

        }
        else{
        var id = req.query.id.toString();
        
                if (parseInt(id)%1!=0) 
        {
            message="id is not valid"
            res.status(406).send("ERROR:"+message)          
                
        }
        else {
            database.getData(res, collection, id)
            
            }
        }
    }
    else
    {
             res.status(406).send("Header Accept not acceptable");
        }

});

