// index.js
require('dotenv').config(); // charge les variables d’environnement

const express = require('express');
const cors = require('cors');
const db = require('./db');



const app = express();
const port = process.env.PORT || 3000;
// Import des routes
const patientsRoutes = require('./routes/patients');
const traitementsRoutes = require('./routes/traitements');
const servicesRoutes = require('./routes/services');

const rdvRoutes = require('./routes/rendezVous');
const schemaDentaireRoutes = require('./routes/schemaDentaire');
const medecinsRoutes = require('./routes/medecins');
const allergiesRoutes = require('./routes/allergies');
const facturesRoutes = require('./routes/factures');

const authRoutes = require('./routes/authRoutes');



// Middlewares
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/patients', patientsRoutes);
app.use('/api/traitements', traitementsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/rendez-vous', rdvRoutes);
app.use('/api/schema-dentaire', schemaDentaireRoutes);
app.use('/api/medecins', medecinsRoutes);
app.use('/api/allergies', allergiesRoutes);
app.use('/api/factures', facturesRoutes);

app.use('/api/auth', authRoutes);
// Route test
app.get('/', async(req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ message: 'Connexion DB OK ✅', now: result.rows[0].now });
      } catch (err) {
        console.error('Erreur lors de la requête :', err);
        res.status(500).json({ error: 'Erreur base de données' });
      }
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur backend en écoute sur http://localhost:${port}`);
});
