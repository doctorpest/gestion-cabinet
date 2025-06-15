const db = require('../db');

exports.ajouterTraitement = async (req, res) => {
  const { patient_id, medecin_id, date_traitement, note, tarif } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO traitements (patient_id, medecin_id, date_traitement, note, tarif)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [patient_id, medecin_id, date_traitement, note, tarif]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du traitement' });
  }
};

exports.modifierTraitement = async (req, res) => {
  const { id } = req.params;
  const { medecin_id, date_traitement, note, tarif } = req.body;

  try {
    const result = await db.query(
      `UPDATE traitements
       SET medecin_id = $1, date_traitement = $2, note = $3, tarif = $4
       WHERE id = $5 RETURNING *`,
      [medecin_id, date_traitement, note, tarif, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

exports.supprimerTraitement = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM traitements WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};
exports.getTraitementsByPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM traitements WHERE patient_id = $1 ORDER BY date_traitement DESC',
      [patientId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
exports.getTraitementsByMedecin = async (req, res) => {
  const { medecinId } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM traitements WHERE medecin_id = $1 ORDER BY date_traitement DESC',
      [medecinId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
