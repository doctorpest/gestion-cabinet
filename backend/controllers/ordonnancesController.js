// const db = require('../db');

// exports.addMedicament = async (req, res) => {
//   const { nom } = req.body;
//   try {
//     const result = await db.query(
//       'INSERT INTO medicaments (nom) VALUES ($1) ON CONFLICT (nom) DO NOTHING RETURNING *',
//       [nom]
//     );
//     res.status(201).json(result.rows[0] || { message: 'Déjà existant' });
//   } catch (err) {
//     res.status(500).json({ error: 'Erreur lors de l’ajout' });
//   }
// };

// exports.getMedicaments = async (_req, res) => {
//   const result = await db.query('SELECT * FROM medicaments ORDER BY nom');
//   res.json(result.rows);
// };
const db = require('../db');

// Ajouter un médicament (si jamais utilisé seul)
exports.addMedicament = async (req, res) => {
  const { nom, dosage, duree } = req.body;
  if (!nom) return res.status(400).json({ error: 'Nom requis' });

  try {
    const result = await db.query(
      `INSERT INTO medicaments (nom, dosage, duree)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nom, dosage || null, duree || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’ajout du médicament' });
  }
};

// Obtenir tous les médicaments
exports.getMedicaments = async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM medicaments ORDER BY nom`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des médicaments' });
  }
};

// Créer une ordonnance avec ses médicaments
exports.create = async (req, res) => {
  const { patient_id, medecin_id, remarque, medicaments } = req.body;

  if (!patient_id || !medecin_id || !Array.isArray(medicaments)) {
    return res.status(400).json({ error: 'Champs requis manquants ou invalides' });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Étape 1: Créer l'ordonnance
    const ordonnanceResult = await client.query(
      `INSERT INTO ordonnances (patient_id, medecin_id, remarque)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [patient_id, medecin_id, remarque || null]
    );
    const ordonnanceId = ordonnanceResult.rows[0].id;

    // Étape 2: Insérer chaque médicament puis la liaison
    for (const medoc of medicaments) {
      const { nom, dosage, duree } = medoc;

      const medocRes = await client.query(
        `INSERT INTO medicaments (nom, dosage, duree)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [nom, dosage || null, duree || null]
      );

      const medicamentId = medocRes.rows[0].id;

      await client.query(
        `INSERT INTO ordonnance_medicaments (ordonnance_id, medicament_id)
         VALUES ($1, $2)`,
        [ordonnanceId, medicamentId]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Ordonnance créée avec succès',
      ordonnance_id: ordonnanceId
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de l’ordonnance' });
  } finally {
    client.release();
  }
};