const db = require('../db');


exports.getAllRendezVous = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, p.nom, p.prenom
      FROM rendez_vous r
      JOIN patients p ON r.patient_id = p.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
  }
};

exports.ajouterRendezVous = async (req, res) => {
  const { patient_id, date_rdv, motif, statut } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO rendez_vous (patient_id, date_rdv, motif, statut)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [patient_id, date_rdv, motif, statut || 'prévu']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du rendez-vous' });
  }
};

exports.modifierRendezVous = async (req, res) => {
  const { id } = req.params;
  const { date_rdv, motif, statut } = req.body;

  try {
    const result = await db.query(
      `UPDATE rendez_vous
       SET date_rdv = $1, motif = $2, statut = $3
       WHERE id = $4 RETURNING *`,
      [date_rdv, motif, statut, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du rendez-vous' });
  }
};

exports.supprimerRendezVous = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM rendez_vous WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du rendez-vous' });
  }
};

exports.mettreAJourStatutsPasses = async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE rendez_vous
       SET statut = 'passé'
       WHERE statut = 'prévu' AND date_rdv < NOW()`
    );

    res.status(200).json({ message: 'Statuts mis à jour' });
  } catch (err) {
    console.error('Erreur mise à jour statuts passés :', err);
    res.status(500).json({ error: 'Erreur mise à jour statuts passés' });
  }
}