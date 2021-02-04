const express = require('express');
const router = express.Router();
const tagController = require('../controllers/Tag');


router.get('/:id?', tagController.getTag);
router.get('/all', tagController.getAllTags);

router.post('/create', tagController.createTag);

module.exports = router;