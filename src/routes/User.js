const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/users', userController.getUsers);
router.get('/users/:id?', userController.getUser);
router.post('/create', userController.createUser);

module.exports = router;