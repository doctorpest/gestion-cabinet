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
    if (patientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Patient introuvable' });
    }

    const patient = patientResult.rows[0];
    patient.age = calculerAge(patient.date_naissance);

    // Traitements + médecin
    const traitementsResult = await db.query(`
      SELECT t.id, t.date_traitement, t.note, t.tarif,
             m.nom AS medecin_nom, m.prenom AS medecin_prenom
      FROM traitements t
      LEFT JOIN medecins m ON t.medecin_id = m.id
      WHERE t.patient_id = $1
      ORDER BY t.date_traitement DESC
    `, [id]);
    patient.traitements = traitementsResult.rows;

    // Convertir tarif en nombre dans traitements
    patient.traitements = traitementsResult.rows.map(t => ({
      ...t,
      tarif: t.tarif !== null ? parseFloat(t.tarif) : null
    }));


    // Rendez-vous
    const rdvResult = await db.query(`
      SELECT id, date_rdv, motif, statut
      FROM rendez_vous
      WHERE patient_id = $1
      ORDER BY date_rdv DESC
    `, [id]);
    patient.rendez_vous = rdvResult.rows;

    // Schéma dentaire
    const schemaResult = await db.query('SELECT image_url FROM schema_dentaire WHERE patient_id = $1', [id]);
    patient.schema_dentaire = schemaResult.rows[0]?.image_url || null;


    // ✅ Services à réaliser (directement dans la table, pas de table "services")
    const servicesResult = await db.query(`
      SELECT id, nom, description, tarif
      FROM services_a_realiser
      WHERE patient_id = $1
      ORDER BY id DESC
    `, [id]);
    patient.services_a_realiser = servicesResult.rows;

    // Convertir tarif en nombre dans services_a_realiser
    patient.services_a_realiser = servicesResult.rows.map(s => ({
      ...s,
      tarif: s.tarif !== null ? parseFloat(s.tarif) : null
    }));


    // ✅ Allergies (description uniquement)
    const allergiesResult = await db.query(`
      SELECT id, description
      FROM allergies
      WHERE patient_id = $1
    `, [id]);
    patient.allergies = allergiesResult.rows;

    res.json(patient);
  } catch (err) {
    console.error('Erreur dans getPatientById :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


exports.createPatient = async (req, res) => {
  const {
    nom, prenom, date_naissance, est_assure = false, pays,
    telephone, situation_familiale, nombre_enfants, couverture_sociale
  } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO patients (nom, prenom, date_naissance, est_assure, pays, telephone, situation_familiale, nombre_enfants, couverture_sociale)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [nom, prenom, date_naissance, est_assure, pays, telephone, situation_familiale, nombre_enfants, couverture_sociale]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du patient' });
  }
};

exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const {
    nom, prenom, date_naissance, est_assure, pays,
    telephone, situation_familiale, nombre_enfants, couverture_sociale
  } = req.body;
  try {
    const result = await db.query(
      `UPDATE patients SET
         nom = $1, prenom = $2, date_naissance = $3, est_assure = $4, pays = $5,
         telephone = $6, situation_familiale = $7, nombre_enfants = $8, couverture_sociale = $9
       WHERE id = $10 RETURNING *`,
      [nom, prenom, date_naissance, est_assure, pays, telephone, situation_familiale, nombre_enfants, couverture_sociale, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

exports.getPatientsAvecFactures = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.id,
        p.nom,
        p.prenom,
        p.couverture_sociale,
        COALESCE(SUM(f.montant_total), 0) AS montant_du,
        COALESCE(SUM(f.montant_paye), 0) AS montant_paye
      FROM patients p
      LEFT JOIN factures f ON f.patient_id = p.id
      GROUP BY p.id, p.nom, p.prenom, p.couverture_sociale
      ORDER BY p.nom
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Erreur SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
  
};

exports.getPatientsAssures = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.id, p.nom, p.prenom, p.couverture_sociale,
        COALESCE(SUM(f.montant_paye), 0) AS montant_paye
      FROM patients p
      LEFT JOIN factures f ON f.patient_id = p.id
      WHERE p.couverture_sociale IS NOT NULL AND p.couverture_sociale != ''
      GROUP BY p.id
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des patients assurés' })
  }
};



exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM patients WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};
