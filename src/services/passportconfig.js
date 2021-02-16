const bcrypt = require("bcrypt");
const db = require("./Connection");
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

    passport.use(
        new localStrategy((email, password, done) => {
            db.query('SELECT * FROM ?? WHERE email = ?', ['users', email], (err, user) => {
                if (err) throw err;
                if (!user) return done(null, false);

                bcrypt.compare(passport, user.password, (err, result) => {
                    if (err) throw err;

                    if (result === true) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
                })
            })
        })

    )
    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    })

    passport.deserializeUser((id, cb) => {
        db.query('SELECT * FROM ?? WHERE id = ?', ['users', id], (err, user) => {
            cb(err, user)
        })
    })
}