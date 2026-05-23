const express = require('express');
const router = express.Router();
const expedienteController = require('../controllers/expedienteController');

// Crear un nuevo expediente
router.post('/', expedienteController.createExpediente);

module.exports = router;
