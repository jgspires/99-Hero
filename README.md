# 99Hero

## About

A simple Node.js based RESTful API webserver that connects to a MongoDB database containing various superheroes.
CRUD functions can be executed using this API in order to create, remove, update and delete superheroes from an existing database following a predefined schema.
Disasters of one of the predefined types may also be announced in any of the predefined cities. When that happens, several superheroes that combat that disaster and work in that city will be returned as a response. The number of heroes depends on the type of disaster given and is slightly random.

Database schemas are defined internally using Mongoose. MongoDB must be running locally for the webserver to work.

## Operations, Routes and Endpoints

Hero CRUD operations may be performed by accessing "99Hero/heroes" using either POST, GET, PUT or DELETE.
For now, please see source code for any potential parameters and hero schema structure.

"Announcing" disasters may be done by accessing "99Hero/heroes/anuncio?desastre=DISASTER_NAME&cidade=CITY_NAME".

Valid disasters are (in portuguese): "assalto a banco", "monstro gigante" and "desastre natural".
Valid cities are: "New York", "Rio de Janeiro" and "Tóquio".

Valid cities and disasters may be added or removed by changing their respective arrays in the "constants.js" file in the root folder.