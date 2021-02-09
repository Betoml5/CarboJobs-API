const express = require('express');
const router = express.Router();
const workerController = require('../controllers/Worker');

router.post('/login', workerController.loginWorker);
router.post('/create', workerController.createWorker);

router.get('/', workerController.getWorkers);
router.get('/:id?', workerController.getWorker);
router.get('/name/:name?', workerController.getWorkerByName);

router.put('/:id?', workerController.updateWorker)
router.put('/rating/:id?', workerController.setRating);

module.exports = router;