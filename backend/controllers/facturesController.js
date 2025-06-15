const db = require('../db');

exports.getAllFacturesByPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM factures WHERE patient_id = $1 ORDER BY date_emission DESC',
      [patientId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createFacture = async (req, res) => {
  const { patient_id, montant_total, montant_paye } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO factures (patient_id, montant_total, montant_paye)
       VALUES ($1, $2, $3) RETURNING *`,
      [patient_id, montant_total, montant_paye ?? 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de la facture' });
  }
};

exports.updateFacture = async (req, res) => {
  const { id } = req.params;
  const { montant_total, montant_paye } = req.body;
  try {
    const result = await db.query(
      `UPDATE factures SET montant_total = $1, montant_paye = $2 WHERE id = $3 RETURNING *`,
      [montant_total, montant_paye, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la facture' });
  }
};

exports.getFactureTotalsByPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const result = await db.query(
      `SELECT 
         COALESCE(SUM(montant_total), 0) AS total_montant, 
         COALESCE(SUM(montant_paye), 0) AS total_paye
       FROM factures
       WHERE patient_id = $1`,
      [patientId]
    );
    res.json(result.rows[0]); // Renvoie un objet { total_montant, total_paye }
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


exports.deleteFacture = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM factures WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });
  }
};
