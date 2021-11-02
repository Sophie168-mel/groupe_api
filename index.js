"use strict";

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000 ;

app.get('/', function (req, res) {
  res.send('Bienvenue sur petits emprunts bientôt en react !');
});

app.listen(PORT, function () {
  console.log('Petits emprunts lancé sur le port :' + PORT);
});