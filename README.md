# Contexte et répartition des tâches

Notre API a pour objectif de renseigner sur les points de stop possibles à différentes échelles (commune, département, région) selon certains critères.   
Pour cela nous avons divisé le groupe en 4: 
> • Justin Chikhaoui était en charge de récupérer la donnée   
> • Romain Meuter était en charge de la mise en place de la base de données (Firebase)   
> • Thierry Pailhas et Gilles Christian étaient en charge de la mise en place du moteur de l'API (GET et POST)   
> • Sophie Ngotala Obiang était en charge du formatage des sorties de l'API   

# Etapes de dévelopement

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

Il se compose de 39 201 individus.

### b. Rezo Pouce API
"**Rezo Pouce API**" est un jeu de données composé d'un fichier.json par commune récupérable individuellement via l'API de rezo pouce.
![plot](https://github.com/Sophie168-mel/groupe_api/blob/main/api_rezo_pouce.png?raw=true)

### c. Mise en commun des 2 jeux de données
La mise en commun de ces deux jeux de données a permis de créer une donnée recensant les points d'auto stop en les mettant dans un réseau d'échelles codé et labelisé.
![plot](https://github.com/Sophie168-mel/groupe_api/blob/main/graph_regroupement_donnees.png)

## Mise en place de la base de données

La base de données est [firebase](https://firebase.google.com/). Elle permet de stocker la donnée et la rendre accéssible à notre API.    
Celle-ci est organisée de façon à accéder facilement aux données dont l'API a besoin.   
Quand elle est interrogée par l'API, elle nous renvoie une réponse en JSON.   
Nous avons pris la décision d'utiliser un stockage à partir d'une base de données car celle-ci nous permet de ne pas ajouter du temps de traitement lors du requêtage. De plus, elle nous évite d'être dépendant des données à récupérer. En effet, celles-ci sont hébergées dans notre base de données de façon à toujours pouvoir utiliser l'API si une des données sources disparait ou évolue (nouveau nom de varaibles).

## Création de l'api

L'api connait deux type de requêtes : 
### **GET**   

> Zone tampon  : renvoie tous les individus dans une zone autour d'un point donné   
> *ex : http://localhost:3000/map?centre="45.140195,5.673187"&rayon=50*   
  - centre
  - rayon

> Count : compte le nombre de point à une échelle donné
> *ex : http://localhost:3000/map/count?echelle="Nom territoire"&value="Grésivaudan"*
  - Commune
  - Département
  - Région

> ID point : renvoie le point en fonction de son id   
> *ex : http://localhost:3000/map/data?id=1861*
  - id

> Limit : renvoie les x premiers points    
> *ex : http://localhost:3000/pouces?limit=10**
  -  limit

### **POST**   

> Add : ajout d'un point d'auto stop
> *ex : http://localhost:3000/pouce?latitude=10&longitude=50&id=7895*
  - latitude + longitude + ?commentaire

## Fonction de formatage des données
### json_to_xml
Permet de formater la réponse de l'API JSON en XML

### json_to_rdf
Permet de formater la réponse de l'API JSON en RDF
