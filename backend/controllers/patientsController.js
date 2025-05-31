const db = require('../db');
const { calculerAge } = require('../utils/date');

exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM patients ORDER BY date_creation DESC');
    const patients = result.rows.map(p => ({
      ...p,
      age: calculerAge(p.date_naissance),
    }));
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
      // Patient
      const patientResult = await db.query('SELECT * FROM patients WHERE id = $1', [id]);
      if (patientResult.rows.length === 0) return res.status(404).json({ error: 'Patient introuvable' });
  
      const patient = patientResult.rows[0];
      patient.age = calculerAge(patient.date_naissance);
  
      // Traitements + services + médecin
      const traitementsResult = await db.query(`
        SELECT t.id, t.date_traitement, t.note,
               s.nom AS service_nom, s.tarif,
               m.nom AS medecin_nom, m.prenom AS medecin_prenom
        FROM traitements t
        LEFT JOIN services s ON t.service_id = s.id
        LEFT JOIN medecins m ON t.medecin_id = m.id
        WHERE t.patient_id = $1
        ORDER BY t.date_traitement DESC
      `, [id]);
      patient.traitements = traitementsResult.rows;
  
      // Rendez-vous
      const rdvResult = await db.query(`
        SELECT id, date_rdv, motif, statut
        FROM rendez_vous
        WHERE patient_id = $1
        ORDER BY date_rdv DESC
      `, [id]);
      patient.rendez_vous = rdvResult.rows;
  
      // Schéma dentaire
      const schemaResult = await db.query(`
        SELECT data FROM schema_dentaire WHERE patient_id = $1
      `, [id]);
      patient.schema_dentaire = schemaResult.rows[0]?.data || {};
  
      res.json(patient);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };
  

exports.createPatient = async (req, res) => {
  const { nom, prenom, date_naissance, est_assure, pays } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO patients (nom, prenom, date_naissance, est_assure, pays)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nom, prenom, date_naissance, est_assure ?? false, pays]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du patient' });
  }
};

exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, date_naissance, est_assure, pays } = req.body;
  try {
    const result = await db.query(
      `UPDATE patients SET nom = $1, prenom = $2, date_naissance = $3, est_assure = $4, pays = $5
       WHERE id = $6 RETURNING *`,
      [nom, prenom, date_naissance, est_assure, pays, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM patients WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};
