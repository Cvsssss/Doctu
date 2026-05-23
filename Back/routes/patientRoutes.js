const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/:id', patientController.getPatientById);
router.get('/:id/timeline', patientController.getTimeline);

router.post('/', patientController.createPatient);

module.exports = router;
