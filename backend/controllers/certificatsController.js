const db = require('../db');

exports.createCertificat = async (req, res) => {
  const { patient_id, medecin_id, contenu } = req.body;
  try {
    await db.query(
      'INSERT INTO certificats (patient_id, medecin_id, contenu) VALUES ($1, $2, $3)',
      [patient_id, medecin_id, contenu]
    );
    res.status(201).json({ message: 'Certificat créé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur création certificat' });
  }
};
