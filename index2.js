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