const db = require('../db');

exports.addMedicament = async (req, res) => {
  const { nom } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO medicaments (nom) VALUES ($1) ON CONFLICT (nom) DO NOTHING RETURNING *',
      [nom]
    );
    res.status(201).json(result.rows[0] || { message: 'Déjà existant' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’ajout' });
  }
};

exports.getMedicaments = async (_req, res) => {
  const result = await db.query('SELECT * FROM medicaments ORDER BY nom');
  res.json(result.rows);
};
