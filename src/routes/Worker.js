const express = require('express');
const router = express.Router();
const workerController = require('../controllers/Worker');

router.post('/login', workerController.loginWorker);
router.post('/create', workerController.createWorker);

router.get('/all', workerController.getWorkers);
router.get('/worker/:id?', workerController.getWorker);
router.get('/name/:name?', workerController.getWorkerByName);
router.get('/rating/:limit?', workerController.getBestWorkers)
router.get('/best', workerController.getBestWorkersWithTags);

router.put('/worker/:id?', workerController.updateWorker)
router.put('/rating/:id?', workerController.setRating);

module.exports = router;