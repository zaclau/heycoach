const fs = require('fs');
const express = require('express');
const {ApolloServer, UserInputError} = require('apollo-server-express');
const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');
const {MongoClient, ObjectId} = require('mongodb');


// Custom Scalars (GraphQL)
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
    const client = new MongoClient(url, { useNewUrlParser: true });

    try {
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        console.log('Connected to MongoDB at', url);
        db = client.db();

        // Additional logging to confirm the database name
        console.log('Using database:', db.databaseName);

    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exit the process with an error code
    }
}


/******************************************* 
GraphQL CODE
********************************************/

const resolvers = {
    DateTime: DateTimeResolver,

    Query: {
        // User Queries
        getUserByEmail: getUserByEmailResolver,
        getUserById: getUserByIDResolver,
        getAllUsers: getAllUsersResolver,
        getAllCoaches: getAllCoachesResolver,
        getAllCoachees: getAllCoacheesResolver,

        // Session Queries
        getAllSessions: getAllSessionsResolver,
        getSessionById: getSessionByIdResolver,
        getAllSessionsForUser: getSessionsForUserResolver
    },

    Mutation: {
        // User Mutations
        signUpUser: signUpUserResolver,
        // updateUserProfile: updateUserProfileResolver,
        // TODO create seperate profile update mutations

        // Session Mutations
        // createSession: createSessionResolver,
        // cancelSession: cancelSessionResolver,

        // Review Mutation
        // submitReview: submitReviewResolver
    }
}


// ############################################
// # RESOLVERS, QUERIES
// ############################################

async function getUserByEmailResolver(_, args) {
    try {
        const { email } = args;
        const user = await db.collection('users').findOne({ email });
        return user;
    } catch (error) {
        throw new Error(`Error in getUserByEmailResolver: ${error.message}`);
    }
}

async function getUserByIDResolver(_, args) {
    try {
        const { userId } = args;
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        return user;
    } catch (error) {
        throw new Error(`Error in getUserByIDResolver: ${error.message}`);
    }
}

async function getAllUsersResolver() {
    try {
        const users = await db.collection('users').find().toArray();
        return users;
    } catch (error) {
        throw new Error(`Error in getAllUsersResolver: ${error.message}`);
    }
}

async function getAllCoachesResolver() {
    try {
        const coaches = await db.collection('users').find({ profileAsCoach: { $ne: null } }).toArray();
        return coaches;
    } catch (error) {
        throw new Error(`Error in getAllCoachesResolver: ${error.message}`);
    }
}

async function getAllCoacheesResolver() {
    try {
        const coachees = await db.collection('users').find({ profileAsCoachee: { $ne: null } }).toArray();
        return coachees;
    } catch (error) {
        throw new Error(`Error in getAllCoacheesResolver: ${error.message}`);
    }
}


//############################################
// SESSION RESOLVERS
//############################################

async function getAllSessionsResolver(_) {
    try {
        const sessions = await db.collection('sessions').find().toArray();
        return sessions.map(session => ({
            ...session,
            _id: session._id.toString(),
            coachId: session.coachId.toString(),
            coacheeId: session.coacheeId.toString(),
            receipt: session.receipt.map(r => ({ ...r, _id: r._id.toString() })),
            review: session.review ? { ...session.review, _id: session.review._id.toString() } : null,
        }));
    } catch (error) {
        throw new Error(`Error Thrown: ${error.message}`);
    }
}

async function getSessionByIdResolver(_, { sessionId }) {
    if (!sessionId) throw new Error("sessionId is required");

    try {
        const sessionObjectId = new ObjectId(sessionId);
        const session = await db.collection('sessions').findOne({ _id: sessionObjectId });

        if (!session) return null;

        return {
            ...session,
            _id: session._id.toString(),
            coachId: session.coachId.toString(),
            coacheeId: session.coacheeId.toString(),
            receipt: session.receipt.map(r => ({ ...r, _id: r._id.toString() })),
            review: session.review ? { ...session.review, _id: session.review._id.toString() } : null,
        };
    } catch (error) {
        throw new Error(`Error Thrown: ${error.message}`);
    }
}

async function getSessionsForUserResolver(_, { userId }) {
    if (!userId) throw new Error("UserId is required");

    try {
        const userIdObj = new ObjectId(userId);
        const query = { $or: [{ coachId: userIdObj }, { coacheeId: userIdObj }] };
        const sessions = await db.collection('sessions').find(query).toArray();

        return sessions.map(session => ({
            ...session,
            _id: session._id.toString(),
            coachId: session.coachId.toString(),
            coacheeId: session.coacheeId.toString(),
            receipt: session.receipt.map(r => ({ ...r, _id: r._id.toString() })),
            review: session.review ? { ...session.review, _id: session.review._id.toString() } : null,
        }));
    } catch (error) {
        throw new Error(`Error Thrown: ${error.message}`);
    }
}

// ############################################
// RESOLVERS, MUTATIONS
// ############################################

async function signUpUserResolver(_, args) {
    try {
        // Extract newUser details from the arguments
        const { newUser } = args;

        const userDocument = {
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            profilePictureUrl: newUser.profilePictureUrl,
        };

        // Insert the new user into the database
        const result = await db.collection('users').insertOne(userDocument);

        // Return the created user object, excluding sensitive fields like password
        return {
            _id: result.insertedId,
            ...userDocument,
        };
    } catch (error) {
        console.error(`Error in signUpUser: ${error.message}`);
        throw new Error(`Error Thrown: ${error.message}`);
    }
}


// /*******************************************
// SERVER INITIALIZATION CODE
// ********************************************/

const app = express();

// Attaching a Static web server.
app.use(express.static('public'));

// Creating and attaching a GraphQL API server.
const server = new ApolloServer({
    typeDefs: fs.readFileSync('server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    }
});


// Start the server
async function startServer() {
    try {
        // Connect to the database first
        await connectToDb();

        // Start the Apollo Server
        await server.start();
        server.applyMiddleware({app, path: '/graphql'});

        // Starting the Express server
        app.listen(3000, function () {
            console.log('App started on port 3000');
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1); // Exit with an error code if server fails to start
    }
}

// Invoke the function to start the server
startServer();

