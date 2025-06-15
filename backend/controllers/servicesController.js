const db = require('../db');

// Récupérer tous les services à réaliser pour un patient donné
exports.getServicesByPatient = async (req, res) => {
  const { patient_id } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM services_a_realiser WHERE patient_id = $1 ORDER BY nom',
      [patient_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer un service à réaliser pour un patient
exports.createServiceARealiser = async (req, res) => {
  const { patient_id, nom, description, tarif } = req.body;

  if (!patient_id || !nom || tarif === undefined) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    const result = await db.query(
      `INSERT INTO services_a_realiser (patient_id, nom, description, tarif)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [patient_id, nom, description || null, tarif]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du service' });
  }
};

// Mettre à jour un service à réaliser
exports.updateServiceARealiser = async (req, res) => {
  const { id } = req.params;
  const { nom, description, tarif } = req.body;

  try {
    const result = await db.query(
      `UPDATE services_a_realiser
       SET nom = $1, description = $2, tarif = $3
       WHERE id = $4
       RETURNING *`,
      [nom, description, tarif, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du service' });
  }
};

// Supprimer un service à réaliser
exports.deleteServiceARealiser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM services_a_realiser WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression du service' });
  }
};
