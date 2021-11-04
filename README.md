# Contexte et répartition des tâches

Notre API a pour but de renseigner sur les points de stop possible à différentes échelles, selon certains critères.   
Pour cela nous avons divisé le groupe en 4 : 
> • Justin Chikhaoui était en charge de récupérer la donnée   
> • Romain Meuter était en charge de la mise en place de la base de données (Firebase)   
> • Thierry Pailhas et Gilles Christian étaient en charge de la mise en place de l'API (GET et POST)   
> • Sophie Ngotala Obiang était en charge du formatage des sorties de l'API   

# Step de dévelopement

## Récupération des données
Les deux jeux de données récupérés sont :
- [communes-departement-region.csv](https://www.data.gouv.fr/fr/datasets/communes-de-france-base-des-codes-postaux/)
- [Rezo Pouce API](https://api.rezopouce.fr/)

### a. communes-departement-region
"**communes-departement-region**" est un jeu de données csv open data mise à disposition par *Mohamed BADAOUI* sur [data.gouv](https://www.data.gouv.fr/fr/).   
Ce jeu de données se compose des nom et code des :
- communes
- départements
- régions

Il se compose de 39201 individus.

### b. Rezo Pouce API
"**Rezo Pouce API**" est un jeu de données composé d'un fichier.json par commune récupérable individuellement via l'API de rezo pouce.
![plot](https://github.com/Sophie168-mel/groupe_api/blob/main/api_rezo_pouce.png?raw=true)

### c. Mise en commun des deux jeux de données
La mise en commun de ces deux jeux de données à permis de créer une donnée recensant les points d'auto stop en les métant dans un réseau d'échelles codé et labelisé.
![plot](https://github.com/Sophie168-mel/groupe_api/blob/main/graph_regroupement_donnees.png)

## Mise en place de la base de données

La base de données est [firebase](https://firebase.google.com/). Celle-ci permet de stocker la donnée et la rendre accéssible à notre API.    
Celle-ci est organiser de telle sorte à permettre d'accéder facilement aux données dont l'API a besoin.   
Quand elle est interrogé par l'API elle nous renvoie une réponse en JSON.   
Nous avons pris la décision d'utiliser un stockage à partir d'une base de données car celle-ci nous permet de ne pas ajouter du temps de traitement lors du requétage. De plus elle nous évite d'être dépendant des données récupérer. En effet celle-cio sont hébergé dans notre base de données de tel sorte à toujours pouvoir utiliser l'api si une des données source disparait ou évolue (nouveau nom de varaibles).

## Création de l'api

L'api connait deux type de reqêtes : 
### **GET**   

> Echelle : renvoie tous les individus à une échelle donnée   
> *ex : http://localhost:3000/map*   
  - Commune
  - Département
  - Région
  - Toute la map

> Count : compte le nombre de point à une échelle
> *ex : http://localhost:3000/map/count*
  - Commune
  - Département
  - Région

> Zone tampon : renvoie tous les individus dans une zone autour d’un point donnée   
> *ex : http://localhost:3000/map?latitude=4.00&longitude=2.14568&taille=500*
  - Point + taille zone

> ID point : renvoie le point en fonciton de son id   
> *ex : http://localhost:3000/map?id=10*
  - id

> Limit : renvoies les x premiers points    
> *ex : http://localhost:3000/pouces?limit=10**
  -  limit

### **POST**   

> Add : ajouter d'un point   
> *ex : http://localhost:3000/pouce?latitude=10&longitude=50&id=7895*
  - latitude + longitude + ?commentaire

> Change : Modifier un individu   
> *ex :
  - id

## Fonction de formatage des données
### json_to_xml
Permet de formater la réponse de l'API JSON en XML

### json_to_rdf
Permet de formater la réponse de l'API JSON en RDF
