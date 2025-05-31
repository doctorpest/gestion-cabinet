const db = require('../db');

exports.getAllAllergiesByPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM allergies WHERE patient_id = $1 ORDER BY id',
      [patientId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createAllergy = async (req, res) => {
  const { patient_id, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO allergies (patient_id, description) VALUES ($1, $2) RETURNING *',
      [patient_id, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'allergie' });
  }
};

exports.updateAllergy = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  try {
    const result = await db.query(
      'UPDATE allergies SET description = $1 WHERE id = $2 RETURNING *',
      [description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'allergie' });
  }
};

exports.deleteAllergy = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM allergies WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'allergie' });
  }
};
