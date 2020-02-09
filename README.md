# Agriness Backend

## Getting started

What you will need?
* Docker 
* NodeJS (if you want to run locally)
* MongoDB (if you want to run locally)

Clone/download the repository 

`git clone git@github.com:joaohencke/agriness.git`  
Open a terminal at cloned repo then `docker-compose up --build`

If you want to run in development mode do:
* Install dependencies `yarn install` at root folder;
* Run `yarn start`

The server will run on [http://localhost:8888](http://localhost:8888) and the API docs will be avaiable on [/api-docs](http://localhost:8888/api-docs)

The user used to login should be created manually.

You can use this cURL below
```bash
curl --request POST \
  --url http://localhost:8888/users \
  --header 'content-type: application/json' \
  --data '{
	"username": "joaohencke",
	"password": "123123"
}'
```

I've created a postinstall script to create the animals into local mongodb -> to see populated database you should run locally or run the [script](./scripts/animals.js) inside the mongo container.