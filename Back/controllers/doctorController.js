const supabase = require('../config/supabaseClient');

const getDailySummary = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query; // Puede usarse para filtrar si existiera la fecha

  try {
    const { data: citasPendientes, error: errorCitas } = await supabase
      .from('agenda_citas')
      .select('id_cita')
      .eq('id_profesional', doctorId)
      .not('estado', 'ilike', '%Cancelada%');

    if (errorCitas) throw errorCitas;

    // Podríamos consultar a otra tabla de mensajes aquí si existiera
    // Simularemos los mensajes
    res.json({
      citasPendientes: citasPendientes ? citasPendientes.length : 0,
      mensajesNuevos: Math.floor(Math.random() * 5) // Mock
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDailySummary
};
