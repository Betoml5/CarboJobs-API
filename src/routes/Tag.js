const express = require('express');
const router = express.Router();
const tagController = require('../controllers/Tag');


router.post('/create', tagController.createTag);
router.get('/tag/:id?', tagController.getTag);


module.exports = router;