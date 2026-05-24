require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const expedienteRoutes = require('./routes/expedienteRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // Permite que el servidor entienda los datos que mande Supabase

// Configuramos la llave secreta de SendGrid
sgMail.setApiKey(process.env.EMAIL_PASS);

// Ruta de prueba para ver si el servidor funciona
app.get('/', (req, res) => {
    res.send('Servidor de Doctu corriendo al 100%');
});

// Rutas de nuestra API
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/expedientes', expedienteRoutes);

// EL PATRÓN OBSERVER (WEBHOOK)
// Esta es la ruta que escuchará las alertas de Supabase
app.post('/api/alertas-seguridad', async (req, res) => {
    try {
        const alertaPayload = req.body; 
        console.log("Alerta enviada");
        console.log("Datos recibidos:", alertaPayload);

        // Mensaje que irá en el correo: doctu.pruebas@gmail.com
        // correo chido que hice para las pruebas, es de forma preliminar y únicamente
        // lo cree para esto jaja
        const msg = {
            to: process.env.EMAIL_FROM, // Destinatario (correo de pruebas)
            from: process.env.EMAIL_FROM, // Remitente (tu correo verificado)
            subject: 'DOCTU - Acceso a Expediente',
            text: 'Se ha registrado un acceso a los datos sensibles de un paciente.',
            html: '<strong>¡Atención!</strong> Se ha registrado un acceso a los datos sensibles de un paciente (PII). <br> Revisa los logs de seguridad inmediatamente.',
        };

        // Disparamos el correo
        await sgMail.send(msg);
        console.log("Correo de alerta enviado con éxito.");

        // Le avisamos a Supabase que recibimos el golpe y todo salió bien
        res.status(200).json({ message: "Alerta procesada y correo enviado" });

    } catch (error) {
        console.error("Error en el envío de la alerta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// --- NUEVA RUTA: AUDITORÍA POR LECTURA (GET) ---
// Esta ruta simula cuando un médico pide ver el expediente de un paciente
app.get('/api/pacientes/:id', async (req, res) => {
    try {
        // 1. Atrapamos el ID del paciente que viene en la URL
        const pacienteId = req.params.id; 
        console.log(`\nLECTURA DETECTADA: Petición para ver el paciente ID: ${pacienteId}`);

        // (Aquí iría la conexión de tus compañeros para extraer los datos reales de Supabase)
        // Por ahora, simulamos los datos que le regresaríamos al Frontend:
        const datosSimulados = { 
            id: pacienteId, 
            diagnostico: "Reservado", 
            estatus: "Confidencial" 
        };

        // 2. ¡EL DISPARADOR DE SEGURIDAD! Mandamos la alerta antes de entregar los datos
        const msg = {
            to: process.env.EMAIL_FROM, 
            from: process.env.EMAIL_FROM, 
            subject: `DOCTU - Lectura de Expediente #${pacienteId}`,
            text: `Se ha visualizado la información confidencial del paciente ${pacienteId}.`,
            html: `<strong>¡Atención!</strong> Se ha consultado el expediente del paciente <b>#${pacienteId}</b>. <br> Si esta lectura no estaba programada en la agenda, revisa los logs de acceso.`,
        };

        await sgMail.send(msg);
        console.log("Correo de auditoría de lectura enviado con éxito.");

        // 3. Finalmente, le entregamos la información al médico (Frontend)
        res.status(200).json({ 
            mensaje: "Acceso autorizado. Datos recuperados.", 
            paciente: datosSimulados 
        });

    } catch (error) {
        console.error("Fallo en la ruta GET:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Levantamos el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Servidor de seguridad escuchando en el puerto ${PORT}`);
});