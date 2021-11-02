# Database firebase

Manage spatial query on firebase: https://firebase.google.com/docs/firestore/solutions/geoqueries

## Why firebase ?

L'utilisation de firebase est du au fait que nous maitrisions déjà des compétences sur ce type de base de donnée.
Nous adaptons l'utilisation de la base de donnée à des requetes spatial.

### Requete associé:


#### GET

get(echelle, valeur, limit)
Retourne une d'arrets de stop. 
   echelle - "str":  est une des trois catégorie : commune, département, région
   valeur - "str": est la valeur donné à l'échelle géographique associé, exemple: "region", "Auvergne".
   limit - "int" : nombre de ligne retourné, par défaut None qui retourne tous

getCount(echelle, valeur, limit)
Retourne le nombre d'arret de stop comptabilisé.
   echelle - "str":  est une des trois catégorie : commune, département, région
   valeur - "str": est la valeur donné à l'échelle géographique associé, exemple: "region", "Auvergne".

#### POST 
AddPoint(lat, long, optionnel)
      Ajout de point de coordonnée GPS.
      lat - "float": est la latitude du points en float,
      long - "float": est la longitude du points en float,
      Optionnel - reste à définir

ModifPoint(id ?) # A définir
   