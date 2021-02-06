const express = require('express');
const router = express.Router();
const tagController = require('../controllers/Tag');


router.post('/create', tagController.createTag);

router.get('/all', tagController.getAllTags);
router.get('/:id?', tagController.getTag);

module.exports = router;