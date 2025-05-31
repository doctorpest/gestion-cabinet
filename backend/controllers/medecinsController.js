const db = require('../db');

exports.getAllMedecins = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM medecins ORDER BY nom, prenom');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getMedecinById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM medecins WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Médecin introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createMedecin = async (req, res) => {
  const { nom, prenom } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO medecins (nom, prenom) VALUES ($1, $2) RETURNING *',
      [nom, prenom]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du médecin' });
  }
};

exports.updateMedecin = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom } = req.body;
  try {
    const result = await db.query(
      'UPDATE medecins SET nom = $1, prenom = $2 WHERE id = $3 RETURNING *',
      [nom, prenom, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du médecin' });
  }
};

exports.deleteMedecin = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM medecins WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du médecin' });
  }
};
