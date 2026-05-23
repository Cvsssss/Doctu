const supabase = require('../config/supabaseClient');

const createExpediente = async (req, res) => {
  const { pacienteId, motivoConsulta, peso, talla, temperatura, presionSistolica, presionDiastolica, diagnostico, planTratamiento } = req.body;

  try {
    // 1. Insert into expediente_general
    const { data: expediente, error: expError } = await supabase
      .from('expediente_general')
      .insert([
        {
          id_paciente: pacienteId || 101, // Mock fallback
          id_cita: 1, // Mock fallback
          id_profesional: 1, // Mock fallback
          tipo_formato: 'GENERAL'
        }
      ])
      .select('id_expediente')
      .single();

    if (expError) throw expError;

    const idExpediente = expediente.id_expediente;

    // 2. Insert into formato_medico_general
    const { error: formError } = await supabase
      .from('formato_medico_general')
      .insert([
        {
          id_expediente: idExpediente,
          motivo_consulta: motivoConsulta,
          peso_kg: parseFloat(peso) || 0,
          talla_cm: parseFloat(talla) || 0,
          temperatura_c: parseFloat(temperatura) || 36.5,
          presion_arterial_sistolica: parseInt(presionSistolica) || 120,
          presion_arterial_diastolica: parseInt(presionDiastolica) || 80,
          diagnostico_principal_cie10: diagnostico,
          plan_tratamiento_receta: planTratamiento
        }
      ]);

    if (formError) throw formError;

    res.status(201).json({ message: 'Expediente creado correctamente', idExpediente });
  } catch (error) {
    console.error('Error creating expediente:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExpediente
};
