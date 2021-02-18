const passport = require("passport");
const bcrypt = require("bcrypt");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const localStrategy = require("passport-local").Strategy;
const db = require("./Connection");

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        db.query(
          "SELECT * FROM ?? WHERE email = ?",
          ["users", email],
          (err, user) => {
            if (err) throw err;
            if (!user) {
              return done(null, false, { message: "User not found" });
            }

            bcrypt.compare(password, user[0].password, (err, result) => {
              if (err) throw err;

              if (result === true) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            });
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: "secret",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (e) {
        done(e);
      }
    }
  )
);
