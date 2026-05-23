const supabase = require('../config/supabaseClient');

const getUpcomingAppointments = async (req, res) => {
  const { patientId } = req.params;
  try {
    const { data, error } = await supabase
      .from('agenda_citas')
      .select(`
        id_cita,
        estado,
        profesionales_perfiles (nombre_completo, especialidad)
      `)
      .eq('id_paciente', patientId);

    if (error) throw error;

    const citas = data.map(cita => ({
      id: cita.id_cita,
      fecha: '2026-05-20', // El diagrama no incluye fecha, se podría agregar a la DB luego
      hora: '10:00',
      doctor: `${cita.profesionales_perfiles?.nombre_completo} (${cita.profesionales_perfiles?.especialidad})`,
      estado: cita.estado
    }));

    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMonthlyAgenda = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const { data, error } = await supabase
      .from('agenda_citas')
      .select(`
        id_cita,
        estado,
        pacientes_pii (nombre_completo)
      `)
      .eq('id_profesional', doctorId);

    if (error) throw error;

    const agenda = data.map(cita => ({
      id: cita.id_cita,
      paciente: cita.pacientes_pii?.nombre_completo || 'Paciente Desconocido',
      hora: '10:00', // Mock temporal si no hay en DB
      estado: cita.estado,
      pago: cita.estado.includes('Confirmada'),
      dia: 15 // Mock temporal si no hay fecha en DB
    }));

    res.json(agenda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const { data, error } = await supabase
      .from('agenda_citas')
      .update({ estado: estado })
      .eq('id_cita', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUpcomingAppointments,
  getMonthlyAgenda,
  updateAppointmentStatus
};
