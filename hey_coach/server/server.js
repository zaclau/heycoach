const fs = require('fs');
const express = require('express');
const {ApolloServer, UserInputError} = require('apollo-server-express');
const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');
const {MongoClient, ObjectId} = require('mongodb');
require("dotenv").config();
console.log(process.env.CLIENT_ID);

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

        // User
        getUserByEmail: getUserByEmailResolver,
        getUserById: getUserByIDResolver,
        getAllUsers: getAllUsersResolver,
        getAllCoaches: getAllCoachesResolver,
        getAllCoachees: getAllCoacheesResolver,

        // Profile

        // Sessions
        getAllSessions: getAllSessionsResolver,
        getSessionById: getSessionByIdResolver,
        getAllSessionsForUser: getSessionsForUserResolver
    }
}


/* ############################################
# RESOLVERS
 ############################################ */

async function genericResolverTemplate(_, args) {
    /*
    Description: Describe what this resolver does.

    Schema:
    type Query {
        yourQueryName(arg1: Type, arg2: Type, ...): ReturnType
    }

    Parameters:
    - arg1: Description of arg1
    - arg2: Description of arg2
    - ...

    Returns: Description of what is returned
    */

    try {
        // Process Inputs
        console.log('Processing inputs...');
        // const { arg1, arg2, ... } = args;
        // Process and validate inputs as needed

        // Database Query
        console.log('Querying database...');
        // const result = await db.collection('yourCollection').findOne({ yourQuery: arg1 });
        // Perform database operations as required

        // Process Result
        console.log('Processing result...');
        // Perform any required processing on the result

        // Return Result
        console.log('Returning result');
        return result;

    } catch (error) {
        // Error Handling
        console.error(`Error in resolver: ${error.message}`);
        throw new Error(`Error Thrown: ${error.message}`);
    }
}

async function getUserByEmailResolver(_, args) {
    /*
    Get a user by his email address

    Schema: ....
    */
    try {
        // Process Inputs
        const {email} = args;
        console.log(email);

        // Query DB
        const userObject = await db.collection('users').findOne({email: email});
        console.log(userObject);

        return userObject

    } catch (error) {
        throw new Error(`Error Thrown: ${error.message}`);
    }
}

async function getUserByIDResolver(_, args) {
    /*
    Description: Returns full user object based on ID

    Schema:
    type Query {
        getUserByIDResolver(userId: ID): User
    }

    Parameters:
    - userId: ID of the user
    - ...

    Returns: Full user type object
    */

    try {
        // Database Connection Check
        console.log('Checking database connection in resolver...');
        if (!db) {
            throw new Error("Database connection not established");
        }

        // Process Inputs
        console.log('Processing inputs...');
        const { userId } = args;

        // Database Query
        console.log('Querying database...');
        const result = await db.collection('users').findOne({ id: userId });

        // Return Result
        console.log('Returning result');
        return result; // Replace 'result' with the actual data to be returned

    } catch (error) {
        // Error Handling
        console.error(`Error in resolver: ${error.message}`);
        throw new Error(`Error Thrown: ${error.message}`);
    }
}

async function getAllUsersResolver(_, args) {
    /*
    Description: get all users as a list of objects.

    Schema:
    type Query {
        getAllUsers(): [Users]
    }

    Returns: array containing all users as objects
    */

    try {
        // Database Connection Check
        console.log('Checking database connection in resolver...');
        if (!db) {
            throw new Error("Database connection not established");
        }

        // Process and validate inputs as needed

        // Database Query
        console.log('Querying database...');
        const result = await db.collection('users').find().toArray();

        // Return Result
        console.log('Returning result');
        return result;

    } catch (error) {
        // Error Handling
        console.error(`Error in resolver: ${error.message}`);
        throw new Error(`Error Thrown: ${error.message}`);
    }
}

async function getAllCoachesResolver(_, args) {
    /*
    Description: Get all users who are coaches.

    Schema:
    type Query {
        getAllCoaches: [User]
    }

    Returns: Array containing all users who are coaches.
    */

    try {
        // Database Query for Coaches
        console.log('Querying database for all coaches...');
        const coaches = await db.collection('users').find({ isCoach: true }).toArray();

        // Return Result
        console.log('Returning result with total coaches:', coaches.length);
        return coaches;

    } catch (error) {
        // Error Handling
        console.error(`Error in getAllCoachesResolver: ${error.message}`);
        throw new Error(`Error Thrown: ${error.message}`);
    }
}

async function getAllCoacheesResolver(_, args) {
    /*
    Description: Get all users who are coaches.

    Schema:
    type Query {
        getAllCoaches: [User]
    }

    Returns: Array containing all users who are coaches.
    */

    try {
        // Database Query for Coaches
        console.log('Querying database for all coaches...');
        const coaches = await db.collection('users').find({ isCoachee: true }).toArray();

        // Return Result
        console.log('Returning result with total coaches:', coaches.length);
        return coaches;

    } catch (error) {
        // Error Handling
        console.error(`Error in getAllCoachesResolver: ${error.message}`);
        throw new Error(`Error Thrown: ${error.message}`);
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



/*******************************************
SERVER INITIALIZATION CODE
********************************************/
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

const passport = require('passport');
require('./passport')(passport);
// Google OAuth routes
// 1. Redirect user to Google login page
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

// 2. Get user data using access token
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        console.log('google callback route called');
        console.log(req.body);
        res.redirect("/profile/");
    }
);

// 3. Get profile after sign in success
app.get("/profile", (req, res) => {
    // console.log(req);
    res.send("Welcome");
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

