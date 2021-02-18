const passport = require('passport')
const localStrategy = require('passport-local').Strategy;
const db = require('./Connection');

passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async(email, password, done)=>{
    try {
        db.query('SELECT * FROM ?? WHERE email = ?', ['users', email], (err, user) => {
            if (!user) {
                return done(null, false, { message: "User not found"})
            }
            
        })
    } catch (error) {
        
    }
}))