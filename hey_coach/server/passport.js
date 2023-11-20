const GoogleStrategy = require("passport-google-oauth2").Strategy;

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback : true
    }, 
    async (request, accessToken, refresToken, profile, done) => {
        try {
            console.log('Google OAUTH success ✔');
            console.log(profile);
            return done(null, null);
        } catch (error) {
            console.log('Google OAUTH failed ❌')
            console.log(error.message);
            return done(null, null);
        }
    }
    )
}