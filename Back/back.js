require('dotenv').config(); 
const express = require('express');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(express.json()); // Permite que el servidor entienda los datos que mande Supabase

// Configuramos la llave secreta de SendGrid
sgMail.setApiKey(process.env.EMAIL_PASS);

// Ruta de prueba para ver si el servidor funciona
app.get('/', (req, res) => {
    res.send('Servidor de Doctu corriendo al 100%');
});

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
        console.log("✅ Correo de alerta enviado con éxito.");

        // Le avisamos a Supabase que recibimos el golpe y todo salió bien
        res.status(200).json({ message: "Alerta procesada y correo enviado" });

    } catch (error) {
        console.error("Error en el envío de la alerta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Levantamos el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🛡️  Servidor de seguridad escuchando en el puerto ${PORT}`);
});