// initmongo.js
  
// To execute:
// $mongosh heycoach initmongo.js
// Above command to be executed from the directory where initmongo.js is present
  
db.dropDatabase();

//############################################
// USERS
//############################################

db.createCollection("users");

var n_coaches = 100;
var n_coachees = 120;

var coachIds = Array.from({length: n_coaches}, (_, i) => i + 1);
var coacheeIds = Array.from({length: n_coachees}, (_, i) => i + n_coaches + 1);

let userList = [];

// Inserting coaches
for (var i in coachIds) {
    var id = coachIds[i];
    userList.push({
        id: id,
        firstName: "CoachFirst" + id,
        lastName: "CoachLast" + id,
        description: "Loving life ❤️",
        profilePictureUrl: "url" + id,
        googleOuthToken: "googleToken" + id,
        stripeCustomerId: "stripeID" + id,
        isCoach: true,
        isCoachee: false
    });
}

// Inserting coachees
for (var i in coacheeIds) {
    var id = coacheeIds[i];
    userList.push({
        id: id,
        firstName: "CoacheeFirst" + id,
        lastName: "CoacheeLast" + id,
        description: "Loving life ❤️",
        profilePictureUrl: "url" + id,
        googleOuthToken: "googleToken" + id,
        stripeCustomerId: "stripeID" + id,
        isCoach: false,
        isCoachee: true
    });
}

db.users.insertMany(userList);

//############################################
// PROFILES
//############################################

// Coaches Profiles
db.createCollection("profilesOfCoaches");
let coachProfiles = [];

for (var i in coachIds) {
    var id = coachIds[i];
    coachProfiles.push({
        userId: id,
        coachText: "I'm a coach",
        tagsOfSpecialties: ["Yoga", "Rock Climbing", "Qigong"],
        sessionDuration: 60,
        sessionPrice: 120.50
    });
}

db.profilesOfCoaches.insertMany(coachProfiles);

// Coachees Profiles
db.createCollection("profilesOfCoachees");
let coacheeProfiles = [];

for (var i in coacheeIds) {
    var id = coacheeIds[i];
    coacheeProfiles.push({
        userId: id,
        tagsOfGoals: ["StrengthBuilding", "Wellness"]
    });
}

db.profilesOfCoachees.insertMany(coacheeProfiles);



//############################################
// SESSIONS
//############################################

db.createCollection("sessions");
db.createCollection("receipts");
db.createCollection("reviews");

var n_sessions = 100;
var sessionStatuses = ["SCHEDULED", "CANCELLED", "COMPLETED"];

for (let i = 0; i < n_sessions; i++) {
    // Randomly select a coach and a coachee
    let randomCoachId = coachIds[Math.floor(Math.random() * coachIds.length)];
    let randomCoacheeId = coacheeIds[Math.floor(Math.random() * coacheeIds.length)];
    let randomStatus = sessionStatuses[Math.floor(Math.random() * sessionStatuses.length)];

    // Create a receipt and insert it
    let receipt = {
        // Fill in receipt details
        stripeId: "stripe_" + i,
        amount: Math.random() * 100,
        status: "PENDING" // Or another logic for status
    };
    let receiptId = db.receipts.insertOne(receipt).insertedId;

    // Create a session and insert it
    let session = {
        coachId: randomCoachId,
        coacheeId: randomCoacheeId,
        dateTime: new Date(), // Replace with actual logic for date-time
        status: randomStatus,
        location: "Location_" + i,
        googleCalendarEventId: "gcal_" + i,
        receiptId: receiptId
    };
    let sessionId = db.sessions.insertOne(session).insertedId;

    // If the session is COMPLETED, create a review
    if (randomStatus === "COMPLETED") {
        let review = {
            sessionId: sessionId,
            text: "Great session!",
            rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
            createdAt: new Date() // Current date-time
        };
        db.reviews.insertOne(review);
    }
}

