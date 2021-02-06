const express = require('express');
const router = express.Router();
const workerController = require('../controllers/Worker');

router.post('/login', workerController.loginWorker);
router.post('/create', workerController.createWorker);

router.get('/all', workerController.getWorkers);
router.get('/:id?', workerController.getWorker);
router.get('/name/:name?', workerController.getWorkerByName);

module.exports = router;