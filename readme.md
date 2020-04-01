# SimpleNetwork

This repository contains two different approaches for a very simplified version of a social network api built in Node.js with MongoDB, Mongoose and Express.

## Features

So far Users can create an account, log in, create, read, update and delete posts.

## installation

Just navigate in the root folder of each api and run npm install. Afterwards add a config.json file which contains a jwt-key and the credentials for your MongoDB-Instance. I used an atlas free tier under https://account.mongodb.com/account/login.
After installing all dependencies you can just run `npm start` and play around with the api.
Therefore I recommend postman for the REST-API and the GraphQL-API can be tested under http://localhost:3000/graphql if the local development server is running. As an alternative you could use GraphQL Playground. This is useful if you want to provide a Authorization Header.

