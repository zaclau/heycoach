const fs = require('fs');
const express = require('express');
const {ApolloServer, UserInputError} = require('apollo-server-express');
const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');
const {MongoClient} = require('mongodb');

/******************************************* 
DATABASE CONNECTION CODE
********************************************/
// Note that the below variable is a global variable
// that is initialized in the connectToDb function and used elsewhere.
let db;

// Function to connect to the database
async function connectToDb() {
    const url = 'mongodb://localhost/assignment3db';
    const client = new MongoClient(url, {useNewUrlParser: true});
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
}

/******************************************* 
GraphQL CODE
********************************************/
const resolvers = {
    Query: { // User Service (USV) Resolvers
        getUserProfile: getUserProfileResolver,

        // Question Service (QSV) Resolvers
        getAllQuestions: getAllQuestionsResolver
    },
    Mutation: {
        // User Service (USV) Resolvers
        signUpUser: signUpUserResolver,
        updateUserProfile: updateUserProfileResolver,
        deregisterUser: deregisterUserResolver,

        // Question Service (QSV) Resolvers
        addQuestion: addQuestionResolver,
        deleteQuestion: deleteQuestionResolver,
        updateQuestion: updateQuestionResolver,
        // Question: QuestionResolver,
    }
};

// ----------------------////////////
// HELPER FUNCTIONS
// ----------------------////////////

async function _validateEmailIsNew(email) { /* Check if email is new, return true if it does not exist in user collection
  
  */
    const existingUser = await db.collection('users').findOne({email});
    if (existingUser) {
        throw new Error('User with this email already exists.');
    }
    return true;
}


async function _validateEmailIsExisting(email) { /* Check if email is present in user collections, return user object if it exists
  
  */
    const existingUser = await db.collection('users').findOne({email});
    if (! existingUser) {
        throw new Error('User with this email does not exist.');
    }
    return existingUser;
}


async function _generateId(db, collectionName) { /* Generates a unique ID for document using monotonically increasing logic 
  
  Logic: 
  - get the max id from the collection
  - return the max id + 1
  */
    const getMaxId = await db.collection(collectionName).aggregate([{
            $group: {
                _id: null,
                maxId: {
                    $max: "$id"
                }
            }
        }]).next();

    return(getMaxId ? getMaxId.maxId : 0) + 1;
}


async function _checkQuestionFields(title, description, complexity) {
    /* Checks that the question fields are valid
  
  Tests:
  - check that title is less than 256 characters 
  - check that description is less than 1024 characters
  - check that complexity is one of the following: "easy", "medium", "hard" 
  */
    // check that title is less than 256 characters
    if (title.trim().length === 0 || title.trim().length > 256) {
        throw new Error('Title must be less than 256 characters and cannot be empty.');
    }

    // check that description is less than 1024 characters
    if (description.trim().length === 0 || description.trim().length > 1024) {
        throw new Error('Description must be less than 1024 characters and cannot be empty.');
    }

    // check that complexity is one of the following: "easy", "medium", "hard"
    if (complexity !== "easy" && complexity !== "medium" && complexity !== "hard") {
        throw new Error('Complexity must be one of the following: easy, medium, hard.');
    }
}

// ----------------------////////////
// Question Service (QSV) Resolvers
// ----------------------////////////

async function _template(_, args) { /*


  Validation Tests:
  - 
  - 
  */
    try {

        const {} = args;

        // ----------------------
        // VALIDATION CHECKS
        // ----------------------

        // ----------------------
        // DB ACTIONS
        // ----------------------

    } catch (error) {
        throw new Error(`Error Thrown: ${
            error.message
        }`);
    }
}

// ----------------------

async function updateQuestionResolver(_, args) { /*
  Update the title, description,etc of a question given the question id. Similar to deleteQuestion, only the owner can update the question

  Schema
  - updateQuestion(email: String!, id: ID!, title: String, description: String, complexity: String): Question


  Validation Tests:
  - validate user using validateEmailIsExisting
  - validate user email matches question email
  */
    try {

        const {
            email,
            id,
            title,
            description,
            complexity
        } = args;

        // ----------------------
        // VALIDATION CHECKS
        // ----------------------

        // check that email is valid using validateEmailIsExisting
        const existingUser = await _validateEmailIsExisting(email);

        // check the question ID exists in the question collections, return the question
        const existingQuestion = await db.collection('questions').findOne({id: parseInt(id)});
        if (! existingQuestion) {
            throw new Error('Question with this ID does not exist.');
        }

        // check that email matches question email
        if (existingQuestion.email !== existingUser.email) {
            throw new Error('Authorization Fail: Email does not match question email.');
        }

        // check for fields
        _checkQuestionFields(title, description, complexity);

        // ----------------------
        // DB ACTIONS
        // ----------------------

        // Update the question in the "questions" collection
        await db.collection('questions').updateOne({
            id: parseInt(id)
        }, {
            $set: {
                title,
                description,
                complexity
            }
        });

        // Retrieve the updated document to return
        const updatedQuestion = await db.collection('questions').findOne({id: parseInt(id)});

        return updatedQuestion

        // Alternative implementaiton if fields are not the same
        // return {
        //    id: updatedQuestion.id,
        //    email: updatedQuestion.email,
        //    title: updatedQuestion.title,
        //    description: updatedQuestion.description,
        //    complexity: updatedQuestion.complexity
        // };


    } catch (error) {
        throw new Error(`Error Thrown: ${
            error.message
        }`);
    }
}


async function getAllQuestionsResolver(_, args) { /*
  Functionality to display information about all the questions in the system, in table format. 
  (implementation for front-end will be done later, but think about the data structure needed for this)

  Schema: 
  -   getAllQuestions: [Question]

  Validation Tests:
  - NA
  */
    try {
        const {} = args;

        // ----------------------
        // DB ACTIONS
        // ----------------------
        const questions = await db.collection('questions').find({}).toArray();
        console.log(questions);
        return questions;

    } catch (error) {
        throw new Error(`Error Thrown: ${
            error.message
        }`);
    }
}


async function deleteQuestionResolver(_, args) { /*
  Delete a question, given a question id
  
  Schema: 
  - deleteQuestion(email: String!, id: ID!): ID

  Validation Tests:
  - check that email is valid using validateEmailIsExisting
  - check that email matches question email
  - check that question ID exists in the question collections

  Status:
  - TESTED
  */
    try {
        const {email, id} = args;
        console.log(email, id);


        // ----------------------
        // VALIDATION CHECKS
        // ----------------------

        // check that email is valid using validateEmailIsExisting
        const existingUser = await _validateEmailIsExisting(email);

        // check the question ID exists in the question collections, return the question
        const existingQuestion = await db.collection('questions').findOne({id: parseInt(id)});
        if (! existingQuestion) {
            throw new Error('Question with this ID does not exist.');
        }

        // check that email matches question email
        if (existingQuestion.email !== existingUser.email) {
            throw new Error('Authorization Fail: Email does not match question email.');
        }

        // ----------------------
        // DB ACTIONS
        // ----------------------

        // Delete the question from the "questions" collection
        const result = await db.collection('questions').deleteOne({id: parseInt(id)});
        console.log(result);

        // check for success of deletion
        if (result.deletedCount === 0) {
            throw new Error('Error deleting question with ID: ${id}');
        } else {
            return id;
        };

    } catch (error) {
        throw new Error(`Error Thrown: ${
            error.message
        }`);
    }
}


async function addQuestionResolver(_, args) { /*
  addQuestion(email: String!, title: String!, description: String!, complexity: String): Question
  Functionality to add a question

  Tests:
  - check that title is less than 256 characters 
  - check that description is less than 1024 characters
  - check that complexity is one of the following: "easy", "medium", "hard"
  */
    try {

        const {email, title, description, complexity} = args;

        // ----------------------
        // VALIDATION CHECKS
        // ----------------------

        // check if email is present in user collections, return user object if it exists
        const existingUser = await _validateEmailIsExisting(email);

        // Check form fields
        _checkQuestionFields(title, description, complexity);

        // ----------------------
        // CREATE AND PUSH NEW QN TO DB
        // ----------------------

        // Create new question document
        const newQuestion = {
            id: await _generateId(db, 'questions'),
            email: existingUser.email, // Link the question to the existing user
            title,
            description,
            complexity
        };

        // Insert the new question into the "questions" collection
        const result = await db.collection('questions').insertOne(newQuestion);

        // Get the inserted question document
        const insertedQuestion = result.ops[0];
        console.log(insertedQuestion);
        return insertedQuestion;
    } catch (error) {
        throw new Error(`Error adding question: ${
            error.message
        }`);
    }
}

// ----------------------////////////
// User Service (USV) Resolvers
// ----------------------////////////

async function signUpUserResolver(_, args) {
    try {
        const {name, email, profile} = args;
        console.log(name, email, profile);
        // Check if the user with the provided email already exists
        await _validateEmailIsNew(email);

        // Create a new user document
        const newUser = {
            id: await _generateId(db, 'users'),
            name,
            email,
            profile
        };

        // Insert the new user into the "users" collection
        const result = await db.collection('users').insertOne(newUser);

        // Get the inserted user document
        const insertedUser = result.ops[0];
        console.log(insertedUser);
        return insertedUser;
    } catch (error) {
        throw new Error(`Error signing up user: ${
            error.message
        }`);
    }
};


async function getUserProfileResolver(_, args) { /*
  displayProfile: this displays the details of the logged in user. 
  Code the API call to fetch/read data from the backend 
  and display it on the reach-based front-end. 
  */

    try {

        const {email} = args;
        console.log(email);

        // create isValidString to validate that email is valid (has @ and . with 2-3 chars after)
        const isValidString = (str) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
        }

        if (! isValidString(email)) {
            throw new Error('Invalid email.');
        }

        // Get the existing user using the validateEmailIsExisting function
        const isExistingUser = await _validateEmailIsExisting(email);
        return isExistingUser.profile;

    } catch (error) {
        throw new Error(`Error getting user profile: ${
            error.message
        }`);
    }
}


async function updateUserProfileResolver(_, args) { /* Edit the user profile corresponding to the user who has logged in. 

  Updates:
  -   profile: UserProfileInput
    -  age: Int
    -  location: String

  Schema
  -   updateUserProfile(email: String!, profile: UserProfileInput!): User

  Validation Tests:
  - check that email is valid using validateEmailIsExisting
  - check that email does not exist in other user documents
  - check that profile fields are valid 
  */
    try {

        const {email, profile} = args;

        // ----------------------
        // VALIDATION CHECKS
        // ----------------------

        // check that email is valid using validateEmailIsExisting
        const existingUser = await _validateEmailIsExisting(email);

        // Check that profile fields are valid
        if (profile.age < 0) {
            throw new Error('Age must be a positive integer.');
        }


        // ----------------------
        // DB ACTIONS
        // ----------------------

        // update the user profile in the "users" collection
        await db.collection('users').updateOne({
            email
        }, {
            $set: {
                profile: profile
            }
        });

        // retrieve updated user docs
        const updatedUser = await db.collection('users').findOne({email});
        console.log(updatedUser);
        return updatedUser;

    } catch (error) {
        throw new Error(`Error Thrown: ${
            error.message
        }`);
    }
}


async function deregisterUserResolver(_, args) { /* Remove the user from the system and remove all associated data.

  Schema
  - deregisterUser(email: String!): ID 

  Validation Tests:
  - check that email of user matches email of account
  - 
  */
    try {

        const {email} = args;

        // ----------------------
        // VALIDATION CHECKS
        // ----------------------
        const existingUser = await _validateEmailIsExisting(email);


        // ----------------------
        // DB ACTIONS
        // ----------------------

        // delete the user from the "users" collection
        await db.collection('users').deleteOne({email});
        console.log('User deleted successfully: ${existingUser.id}');

        // delete all questions
        const deleteQuestions = await db.collection('questions').deleteMany({email});
        console.log(`User questions deleted: ${
            deleteQuestions.deletedCount
        }`);


        return existingUser.id;

    } catch (error) {
        throw new Error(`Error Thrown: ${
            error.message
        }`);
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
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    }
});
server.applyMiddleware({app, path: '/graphql'});

// Starting the server that runs forever.
(async function () {
    try {
        await connectToDb();
        app.listen(3000, function () {
            console.log('App started on port 3000');
        });
    } catch (err) {
        console.log('ERROR:', err);
    }
})();
