// initmongo.js

// To execute:
// $mongosh heycoach initmongo.js
// Above command to be executed from the directory where initmongo.js is present

let db;

db.dropDatabase();

//############################################
// USERS
//############################################

db.createCollection("users");

let n_coaches = 20;
let n_coachees = 20;
var n_sessions = 1000;

let coachProfiles = [];
let coacheeProfiles = [];

// Inserting coaches and coachees
for (let i = 1; i <= n_coaches + n_coachees; i++) {
    let isCoach = i <= n_coaches;
    let user = {
        email: "user" + i + "@gmail.com",
        firstName: isCoach ? "CoachFirst" + i : "CoacheeFirst" + i,
        lastName: isCoach ? "CoachLast" + i : "CoacheeLast" + i,
        description: "Loving life ❤️",
        profilePictureUrl: "url" + i,
        googleOuthToken: "googleToken" + i,
        stripeCustomerId: "stripeID" + i,
        isCoach: isCoach,
        isCoachee: !isCoach
    };

    let userId = db.users.insertOne(user).insertedId;

    // Create corresponding profiles
    if (isCoach) {
        coachProfiles.push({
            userId: userId,
            coachText: "I'm a coach",
            tagsOfSpecialties: ["Yoga", "Rock Climbing", "Qigong"],
            sessionDuration: 60,
            sessionPrice: 120.50
        });
    } else {
        coacheeProfiles.push({
            userId: userId,
            tagsOfGoals: ["StrengthBuilding", "Wellness"]
        });
    }
}

// Insert coach and coachee profiles
db.createCollection("profilesOfCoaches");
db.profilesOfCoaches.insertMany(coachProfiles);

db.createCollection("profilesOfCoachees");
db.profilesOfCoachees.insertMany(coacheeProfiles);

// ...previous code...

//############################################
// SESSIONS
//############################################

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


// db.createCollection("sessions");
// db.createCollection("receipts");
// db.createCollection("reviews");
//
// var sessionStatuses = ["SCHEDULED", "CANCELLED", "COMPLETED"];
//
// // Fetch Coach and Coachee IDs
// var coachIds = db.users.find({ isCoach: true }).toArray().map(user => user._id);
// var coacheeIds = db.users.find({ isCoachee: true }).toArray().map(user => user._id);
//
// for (let i = 0; i < n_sessions; i++) {
//     // Randomly select a coach and a coachee
//     let randomCoachId = coachIds[Math.floor(Math.random() * coachIds.length)];
//     let randomCoacheeId = coacheeIds[Math.floor(Math.random() * coacheeIds.length)];
//     let randomStatus = sessionStatuses[Math.floor(Math.random() * sessionStatuses.length)];
//
//     // Create a receipt and insert it
//     let receipt = {
//         stripeId: "stripe_" + i,
//         amount: Math.random() * 100,
//         status: "PENDING" // or another logic for status
//     };
//     let receiptId = db.receipts.insertOne(receipt).insertedId;
//
//     // Create a session and insert it
//     let session = {
//         coachId: randomCoachId,
//         coacheeId: randomCoacheeId,
//         dateTime: new Date(), // Replace with actual logic for date-time
//         status: randomStatus,
//         location: "Location_" + i,
//         googleCalendarEventId: "gcal_" + i,
//         receiptId: receiptId
//     };
//     let sessionId = db.sessions.insertOne(session).insertedId;
//
//     // If the session is COMPLETED, create a review
//     if (randomStatus === "COMPLETED") {
//         let review = {
//             sessionId: sessionId,
//             text: "Great session!",
//             rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
//             createdAt: new Date() // Current date-time
//         };
//         db.reviews.insertOne(review);
//     }
// }
//
