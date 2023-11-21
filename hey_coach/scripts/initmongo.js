// ########################################################################################
// initmongo.js
// To execute:
// $mongosh heycoach initmongo.js
// Above command to be executed from the directory where initmongo.js is present
// ########################################################################################


// Imports & Inits
const faker = require('@faker-js/faker').faker; // library for synthetic emails, names, pictures, etc

let db;
db.dropDatabase()

//############################################
// USERS
//############################################

db.createCollection("users");

let n_users = 100; // Total number of users
let n_sessions = 1000;

for (let i = 1; i <= n_users; i++) {
    let user = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        profilePicture: faker.image.urlLoremFlickr({
            category: "portrait",
            height: 500,
            width: 500
        }),
        googleOuthToken: "googleToken_" + i,
        stripeCustomerId: "stripeID_" + i,
        profileAsCoach: i % 2 === 0 ? {
            description: faker.lorem.paragraph(),
            tagsOfSpecialties: faker.lorem.words(3).split(' '),
            sessionDuration: faker.number.int({ min: 30, max: 120 }),
            sessionPrice: faker.commerce.price()
        } : null,
        profileAsCoachee: i % 2 !== 0 ? {
            description: faker.lorem.paragraph(),
            tagsOfGoals: ["StrengthBuilding", "Wellness"]
        } : null
    };

    db.users.insertOne(user);
}


//############################################
// SESSIONS
//############################################

db.createCollection("sessions");

var sessionStatuses = ["SCHEDULED", "CANCELLED", "COMPLETED"];

// Fetch Coach and Coachee IDs
var coachIds = db.users.find({ isCoach: true }).toArray().map(user => user._id);
var coacheeIds = db.users.find({ isCoachee: true }).toArray().map(user => user._id);

for (let i = 0; i < n_sessions; i++) {
    // Randomly select a coach and a coachee
    let randomCoachId = coachIds[Math.floor(Math.random() * coachIds.length)];
    let randomCoacheeId = coacheeIds[Math.floor(Math.random() * coacheeIds.length)];
    let randomStatus = sessionStatuses[Math.floor(Math.random() * sessionStatuses.length)];

    // Create receipt objects
    let receipts = [{
        stripeId: "stripe_" + i,
        amount: Math.random() * 100,
        status: "PENDING" // or another logic for status
    }];

    // Optionally create a review object if the session is COMPLETED
    let review;
    if (randomStatus === "COMPLETED") {
        // Create a review object if the session is completed
        review = {
            text: "Great session!",
            rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
            createdAt: new Date() // Current date-time
        };
    } else {
        // Set review to null if the session is not completed
        review = null;
    }

    // Create a session and insert it
    let session = {
        coachId: randomCoachId,
        coacheeId: randomCoacheeId,
        dateTime: new Date(), // Replace with actual logic for date-time
        status: randomStatus,
        location: "Location_" + i,
        googleCalendarEventId: "gcal_" + i,
        receipt: receipts,
        review: review
    };

    db.sessions.insertOne(session);
}
