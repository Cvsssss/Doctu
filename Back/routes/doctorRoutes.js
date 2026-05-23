const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/:doctorId/summary', doctorController.getDailySummary);

module.exports = router;
