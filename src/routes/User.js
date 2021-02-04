const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/login', userController.loginUser);
router.post('/create', userController.createUser);

router.get('/users', userController.getUsers);
router.get('/:id?', userController.getUser);

module.exports = router;