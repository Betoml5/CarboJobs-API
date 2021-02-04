const express = require('express');
const app = express();


const usersRoutes = require('./routes/user')
const tagRoutes = require('./routes/Tag');
const workersRoutes = require('./routes/Worker')

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/api/users", usersRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/workers', workersRoutes)

module.exports = app;