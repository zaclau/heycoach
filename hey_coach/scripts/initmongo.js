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

let n_users = 300; // Total number of users
let n_sessions = 2000;

const goals = ["StrengthBuilding", "EnduranceBuilding", "AgilityBuilding", "FatBurn", "Wellness", "MentalFocus"]
const specialties = ["Judo", "Yoga", "BJJ", "Running", "Acrobatics", "Dance"]

for (let i = 1; i <= n_users; i++) {
    let user = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        profilePicture: faker.image.urlLoremFlickr({
            category: "animal&&portrait",
            height: 300,
            width: 300
        }),
        googleOuthToken: faker.database.mongodbObjectId(),
        stripeCustomerId: faker.database.mongodbObjectId(),
        profileAsCoach: i % 2 === 0 ? {
            description: faker.lorem.paragraph(),
            tagsOfSpecialties: [specialties[Math.floor(Math.random() * specialties.length)], specialties[Math.floor(Math.random() * specialties.length)]],
            sessionDuration: faker.number.int({ min: 30, max: 120 }),
            sessionPrice: faker.commerce.price(),
            location: faker.location.streetAddress()
        } : null,
        profileAsCoachee: i % 2 !== 0 ? {
            description: faker.lorem.paragraph(),
            tagsOfGoals: [goals[Math.floor(Math.random() * goals.length)], goals[Math.floor(Math.random() * goals.length)]]
        } : null
    };

    db.users.insertOne(user);
}


//############################################
// SESSIONS
//############################################

db.createCollection("sessions");

let sessionStatuses = ["SCHEDULED", "CANCELLED", "COMPLETED"];

// Fetch Coach and Coachee IDs
let coachIds = db.users.find({ profileAsCoach: { $exists: true } }).toArray().map(user => user._id);
let coacheeIds = db.users.find({ profileAsCoachee: { $exists: true } }).toArray().map(user => user._id);

for (let i = 0; i < n_sessions; i++) {
    // Randomly select a coach and a coachee
    let randomCoachId = coachIds[Math.floor(Math.random() * coachIds.length)];
    let randomCoacheeId = coacheeIds[Math.floor(Math.random() * coacheeIds.length)];
    let randomStatus = sessionStatuses[Math.floor(Math.random() * sessionStatuses.length)];

    // Create receipt objects
    let receipts = [{
        stripeId: faker.database.mongodbObjectId(),
        amount: faker.finance.amount(),
        status: "PENDING"
    }];

    // Create a review object if the session is COMPLETED
    let review;
    if (randomStatus === "COMPLETED") {
        // Create a review object if the session is completed
        review = {
            text: faker.lorem.sentences(3),
            rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
            createdAt: faker.date.anytime()
        };
    } else {
        // Set review to null if the session is not completed
        review = null;
    }

    // Create a session and insert it t
    let session = {
        coachId: randomCoachId,
        coacheeId: randomCoacheeId,
        dateTime: faker.date.anytime(),
        status: randomStatus,
        location: faker.location.streetAddress(),
        googleCalendarEventId: "gcal_" + i,
        receipt: receipts,
        review: review
    };

    db.sessions.insertOne(session);
}
