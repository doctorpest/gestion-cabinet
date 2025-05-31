const db = require('../db');

exports.creerOuMettreAJourSchema = async (req, res) => {
  const { patient_id, data } = req.body;

  try {
    const existing = await db.query(
      'SELECT * FROM schema_dentaire WHERE patient_id = $1',
      [patient_id]
    );

    if (existing.rows.length > 0) {
      // Mise à jour
      const update = await db.query(
        'UPDATE schema_dentaire SET data = $1 WHERE patient_id = $2 RETURNING *',
        [data, patient_id]
      );
      res.json(update.rows[0]);
    } else {
      // Création
      const insert = await db.query(
        'INSERT INTO schema_dentaire (patient_id, data) VALUES ($1, $2) RETURNING *',
        [patient_id, data]
      );
      res.status(201).json(insert.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur schéma dentaire' });
  }
};
