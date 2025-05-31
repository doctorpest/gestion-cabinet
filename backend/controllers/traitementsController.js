const db = require('../db');

exports.ajouterTraitement = async (req, res) => {
  const { patient_id, service_id, medecin_id, date_traitement, note } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO traitements (patient_id, service_id, medecin_id, date_traitement, note)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [patient_id, service_id, medecin_id, date_traitement, note]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du traitement' });
  }
};

exports.modifierTraitement = async (req, res) => {
  const { id } = req.params;
  const { service_id, medecin_id, date_traitement, note } = req.body;

  try {
    const result = await db.query(
      `UPDATE traitements
       SET service_id = $1, medecin_id = $2, date_traitement = $3, note = $4
       WHERE id = $5 RETURNING *`,
      [service_id, medecin_id, date_traitement, note, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

exports.supprimerTraitement = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM traitements WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};
