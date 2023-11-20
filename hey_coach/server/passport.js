const GoogleStrategy = require("passport-google-oauth2").Strategy;

module.exports = (passport, db) => {
    console.log(process.env.CLIENT_ID);
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback : true
    }, 
    async (request, accessToken, refresToken, profile, done) => {
        try {
            console.log('Google OAuth success ✅');
            console.log(profile.email);
            // console.log(accessToken);
            const user = await db.collection('users').findOne({ email: profile.email });
            if (user) {
                return done(null, user);
            }
            const newUser = await db.collection('users').insertOne({
                id: 200,
                email: profile.email,
                firstName: 'testUser'
            });
            const insertedUser = await db.collection('users').findOne({ email: profile.email });
            return done(null, insertedUser);
        } catch (error) {
            console.log('Google OAuth failed ❌')
            console.log(error.message);
            return done(null, null);
        }
    }
    ))
}