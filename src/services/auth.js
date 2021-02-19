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
    (email, password, done) => {
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
                console.log("Logeando usuario... generando token...");
                return done(null, user[0]);
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
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken("secret_token"),
    },
    (token, done) => {
      try {
        if (!token) {
          return done(null, "Token required");
        }
        console.log("VALIDANDO TOKEN...");
        return done(null, token);
      } catch (e) {
        done(e);
      }
    }
  )
);
