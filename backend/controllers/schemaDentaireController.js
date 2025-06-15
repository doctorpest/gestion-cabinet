// const db = require('../db');

// exports.creerOuMettreAJourSchema = async (req, res) => {
//   const { patient_id, data } = req.body;

//   try {
//     const existing = await db.query(
//       'SELECT * FROM schema_dentaire WHERE patient_id = $1',
//       [patient_id]
//     );

//     if (existing.rows.length > 0) {
//       // Mise à jour
//       const update = await db.query(
//         'UPDATE schema_dentaire SET data = $1 WHERE patient_id = $2 RETURNING *',
//         [data, patient_id]
//       );
//       res.json(update.rows[0]);
//     } else {
//       // Création
//       const insert = await db.query(
//         'INSERT INTO schema_dentaire (patient_id, data) VALUES ($1, $2) RETURNING *',
//         [patient_id, data]
//       );
//       res.status(201).json(insert.rows[0]);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erreur schéma dentaire' });
//   }
// };
const db = require('../db')
const multer = require('multer')
const path = require('path')

// dossier pour stocker les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/schemas')),
  filename: (req, file, cb) => cb(null, `schema_${req.body.patient_id}${path.extname(file.originalname)}`)
})

const upload = multer({ storage })

exports.uploadSchema = [
  upload.single('file'),
  async (req, res) => {
    const { patient_id } = req.body
    const image_url = `/uploads/schemas/${req.file.filename}`
    try {
      const exists = await db.query('SELECT id FROM schema_dentaire WHERE patient_id = $1', [patient_id])
      if (exists.rows.length) {
        await db.query('UPDATE schema_dentaire SET image_url = $1 WHERE patient_id = $2', [image_url, patient_id])
      } else {
        await db.query('INSERT INTO schema_dentaire (patient_id, image_url) VALUES ($1, $2)', [patient_id, image_url])
      }
      res.json({ image_url })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erreur lors de l’upload du schéma' })
    }
  }
]

exports.getSchemaByPatient = async (req, res) => {
  const { patientId } = req.params
  try {
    const result = await db.query('SELECT image_url FROM schema_dentaire WHERE patient_id = $1', [patientId])
    if (result.rows.length) {
      res.json({ image_url: result.rows[0].image_url })
    } else {
      res.json({ image_url: null })
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
