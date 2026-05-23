const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/patient/:patientId/upcoming', appointmentController.getUpcomingAppointments);
router.get('/doctor/:doctorId/monthly', appointmentController.getMonthlyAgenda);
router.patch('/:id/status', appointmentController.updateAppointmentStatus);

module.exports = router;
