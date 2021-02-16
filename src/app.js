const express = require('express');
const helment = require('helmet');
const cors = require('cors');
const session = require('express-session');
const app = express();


// Importing Routes
const usersRoutes = require('./routes/user')
const tagRoutes = require('./routes/Tag');
const workersRoutes = require('./routes/Worker');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// Cors is used to allow the domains that we want.
// Example we can put here http:localhost:3000;
// And with this configuration, the server will work only with request from that domain.
app.use(cors());
app.use(helment());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'mysecretcode',
    resave: true,
    saveUninitialized: true

}))

app.use(cookieParser('mysecretcode'));

app.use(passport.initialize());
app.use(passport.session());

require('./services/passportconfig')(passport);


app.use("/api/users", usersRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/workers', workersRoutes)

module.exports = app;