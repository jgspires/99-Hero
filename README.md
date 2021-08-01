# 99Hero

## About

A simple Node.js based RESTful API webserver that connects to a MongoDB database containing various superheroes.
CRUD functions can be executed using this API in order to create, remove, update and delete superheroes from an existing database following a predefined schema.
Disasters of one of the predefined types may also be announced in any of the predefined cities. When that happens, several superheroes that combat that disaster and work in that city will be returned as a response. The number of heroes depends on the type of disaster given and is slightly random.

Database schemas are defined internally using Mongoose. MongoDB must be running locally for the webserver to work.

## Considerations

Hero CRUD operations may be performed by accessing "99Hero/heroes" using either POST, GET, PUT or DELETE.
Operation structure and parameters are provided further into this documentation.

### Please consider the following variables and valid values:

#### URI Variables:

```
{{base}} = http://127.0.0.1:3000
{{store}} = 99Hero
```

#### Valid Request Data:

Valid disasters are (in portuguese): "assalto a banco", "monstro gigante" and "desastre natural".

Valid cities are: "New York", "Rio de Janeiro" and "Tóquio".

Valid "trabEquipe" (teamwork) values: "sim", "nao" and "indiferente".

All "trabEquipe" data is optional. If no "trabEquipe" value is given, it defaults to "indiferente".

Valid cities and disasters may be added or removed by changing their respective arrays in the "constants.js" file in the root folder.

Any query parameters must be inserted after the route and after a "?", as such:
```
{{base}}/{{store}}/heroes?codinome=Wolverine
```

Multiple parameters are concatenated with "&":
```
{{base}}/{{store}}/heroes?codinome=Wolverine&desastre=assalto a banco
```

## Operation Structure

### POSTs:

Adds a new hero based on given body.

#### Request:

```
{{base}}/{{store}}/heroes
```

#### Body:

```
{
    "nomeReal": "Peter Parker",
    "codinome": "Spiderman",
    "desastres": ["assalto a banco", "desastre natural"],
    "cidades": ["New York"],
    "trabEquipe": "nao"
}
```

### GETs:

Returns multiple heroes or a single hero depending on specified parameters.

#### Request:

```
{{base}}/{{store}}/heroes
```

GET requests can take any combination of the following query parameters (including none):

* codinome: a hero's (not real) name. If included, will always return at most one hero.
* desastre: the name of a valid disaster type.
* cidade: the name of a valid city.

### PUTs:

Edits a single hero based on their public name and the given body.

#### Request:

```
{{base}}/{{store}}/heroes?codinome=HERO_NAME
```

#### Body:

```
{
    "nomeReal": "Peter Parker",
    "codinome": "Spiderman",
    "desastres": ["assalto a banco", "desastre natural"],
    "cidades": ["New York"],
    "trabEquipe": "nao"
}
```
### DELETEs:

Deletes a single hero based on their public name.

#### Request:

```
{{base}}/{{store}}/heroes?codinome=HERO_NAME
```

### Disaster Announcements:

Returns a random number of heroes that work in the provided city and fight the provided type of disaster, prioritizing those that do not mind teamwork.

#### Request:

```
{{base}}/{{store}}/anuncio?desastre=DISASTER_NAME&cidade=CITY_NAME
```
First, only heroes who DO NOT dislike working as a team are chosen to fight the disaster. If more heroes are needed after these are picked then teamwork averse heroes are chosen to meet the hero quota for that disaster.
Number of selected heroes for disaster depends on disaster type provided:
* assalto a banco: 1 - 3 heroes.
* monstro gigante: 2 - 5 heroes.
* desastre natural: 3 - 6 heroes.
