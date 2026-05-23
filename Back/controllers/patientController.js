const supabase = require('../config/supabaseClient');

const getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('pacientes_pii')
      .select('id_paciente, nombre_completo')
      .eq('id_paciente', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Paciente no encontrado' });

    res.json({ id: data.id_paciente, nombre: data.nombre_completo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTimeline = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Obtener expedientes generales
    const { data: expedientes, error } = await supabase
      .from('expediente_general')
      .select(`
        id_expediente,
        tipo_formato,
        agenda_citas (
          id_profesional,
          profesionales_perfiles (nombre_completo)
        )
      `)
      .eq('id_paciente', id);

    if (error) throw error;

    // 2. Obtener los detalles de los formatos por separado para evitar queries muy complejas si no hay FK perfectas
    // (En producción se podría hacer con una vista o un inner join más avanzado)
    let timelineData = [];

    for (let exp of expedientes) {
      let record = {
        id: exp.id_expediente,
        tipo: exp.tipo_formato,
        doctor: exp.agenda_citas?.profesionales_perfiles?.nombre_completo || 'Doctor General',
        fecha: '2026-05-10', // Simulado temporalmente por si falta en DB (el diagrama no tiene fecha en EXPEDIENTE_GENERAL)
        diagnostico: '',
        detalle: ''
      };

      if (exp.tipo_formato === 'GENERAL') {
        const { data: formGen } = await supabase.from('formato_medico_general').select('*').eq('id_expediente', exp.id_expediente).single();
        if (formGen) {
          record.diagnostico = formGen.diagnostico_principal;
          record.detalle = 'Atención médica general.';
        }
      } else if (exp.tipo_formato === 'ODONTOLOGIA') {
        const { data: formOdo } = await supabase.from('formato_odontologia').select('*').eq('id_expediente', exp.id_expediente).single();
        if (formOdo) {
          record.diagnostico = `Procedimiento: ${formOdo.procedimiento_realizado}`;
          record.detalle = `Pieza: ${formOdo.pieza_dental_fdi}`;
        }
      } else if (exp.tipo_formato === 'PSICOLOGIA') {
        const { data: formPsi } = await supabase.from('formato_psicologia').select('*').eq('id_expediente', exp.id_expediente).single();
        if (formPsi) {
          record.diagnostico = 'Evaluación Psicológica';
          record.detalle = formPsi.notas_terapia;
        }
      }

      timelineData.push(record);
    }

    res.json(timelineData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPatient = async (req, res) => {
  const { nombreCompleto, curp, email, telefono, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('pacientes_pii')
      .insert([
        {
          nombre_completo: nombreCompleto,
          curp: curp,
          email: email,
          telefono: telefono,
          password_hash: password
        }
      ])
      .select('id_paciente')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Paciente creado', id: data.id_paciente });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPatientById,
  getTimeline,
  createPatient
};
