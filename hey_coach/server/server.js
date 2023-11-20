const fs = require('fs');
const express = require('express');
const {ApolloServer, UserInputError} = require('apollo-server-express');
const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');
const {MongoClient} = require('mongodb');

// Import graphql scalars
const { DateTimeResolver } = require('graphql-scalars');

/******************************************* 
DATABASE CONNECTION CODE
********************************************/
// Note that the below variable is a global variable
// that is initialized in the connectToDb function and used elsewhere.
let db;

// Function to connect to the database
async function connectToDb() {
    const url = 'mongodb://localhost/heycoach';
    const client = new MongoClient(url, {useNewUrlParser: true});
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
}

/******************************************* 
GraphQL CODE
********************************************/

const resolvers = {
    DateTime: DateTimeResolver,

    Query: {

        // User
        getUserByEmail: getUserByEmailResolver,
        getUserById: getUserByIDResolver,
        getAllUsers: getAllUsersResolver,

        // Profile

        // Sessions
        getAllSessionsForUser: getSessionsForUserResolver,
        getPastSessionsforUser: getPastSessionsForUserResolver
    }
}

async function getUserByEmailResolver(_, args){
}

async function getUserByIDResolver(_, args){
}

async function getAllUsersResolver(_, args){
}

async function getSessionsForUserResolver(_, args){
}

async function getPastSessionsForUserResolver(_, args){
}

/******************************************* 
SERVER INITIALIZATION CODE
********************************************/

/*******************************************
SERVER INITIALIZATION CODE
********************************************/
const app = express();

// Attaching a Static web server.
app.use(express.static('public'));

// Creating and attaching a GraphQL API server.
const server = new ApolloServer({
    typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    }
});

// Start the Apollo Server before applying middleware
(async function startServer() {
    await server.start();
    server.applyMiddleware({app, path: '/graphql'});

    // Starting the Express server
    app.listen(3000, function () {
        console.log('App started on port 3000');
    });
})();

// OLD VERSION FROM PROF
// const app = express();
//
// // Attaching a Static web server.
// app.use(express.static('public'));
//
// // Creating and attaching a GraphQL API server.
// const server = new ApolloServer({
//     typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
//     resolvers,
//     formatError: error => {
//         console.log(error);
//         return error;
//     }
// });
// server.applyMiddleware({app, path: '/graphql'});
//
// // Starting the server that runs forever.
// (async function () {
//     try {
//         await connectToDb();
//         app.listen(3000, function () {
//             console.log('App started on port 3000');
//         });
//     } catch (err) {
//         console.log('ERROR:', err);
//     }
// })();
