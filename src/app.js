const express = require('express');
const app = express();


const usersRoutes = require('./routes/user')
const tagRoutes = require('./routes/Tag');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/api/users", usersRoutes)
app.use('/api/tags', tagRoutes)

module.exports = app;