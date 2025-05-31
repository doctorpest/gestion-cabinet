const db = require('../db');

exports.getAllServices = async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM services ORDER BY nom');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };
  
  exports.createService = async (req, res) => {
    const { nom, description, tarif } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO services (nom, description, tarif) VALUES ($1, $2, $3) RETURNING *',
        [nom, description, tarif]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la création du service' });
    }
  };
  
  exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { nom, description, tarif } = req.body;
    try {
      const result = await db.query(
        'UPDATE services SET nom = $1, description = $2, tarif = $3 WHERE id = $4 RETURNING *',
        [nom, description, tarif, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du service' });
    }
  };
  

exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM services WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du service' });
  }
};
