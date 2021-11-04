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

app.get('/map/data', function(req, res){
    if (IsRequestHeaderAcceptValid(req)) 
    {
        var id = req.query.zoom.toString();
        
        
        var message=""
        if (parseInt(id)%1!=0) 
        {
            message="id is not valid"
            res.status(406).send("ERROR:"+message)          
                
        }
        else {
            database.getData(res, collection, id)
            
        }
    }
    else
    {
             res.status(406).send("Header Accept not acceptable");
        }

});

app.get('/map/count', function(req, res){
    if (IsRequestHeaderAcceptValid(req)) 
    {
        var zoom = req.query.zoom;
        var value = req.query.value.toString();
        
        var message=""
        if ((zoom != "code_departement" | zoom != "ID territoire" | zoom != "code_region")) 
        {
            message="  Variable zoom non definie et\/ou non valorisée dans l\'URL. Valeurs possibles: ID territoire ou code_departement ou code_region"
            res.status(406).send("ERROR:"+message)          
                
        }
        else {
            database.GetCountValue(res, collection, zoom, valeur)
            
        }
    }
    else
    {
             res.status(406).send("Header Accept not acceptable");
        }

});