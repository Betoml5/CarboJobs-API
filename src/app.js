const express = require('express');
const helment = require('helmet');
const cors = require('cors');
const app = express();

require('./services/auth');

const usersRoutes = require('./routes/user')
const tagRoutes = require('./routes/Tag');
const workersRoutes = require('./routes/Worker')


app.use(cors());
app.use(helment());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/workers', workersRoutes)

module.exports = app;