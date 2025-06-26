// index.js
require('dotenv').config(); // charge les variables d’environnement

const express = require('express');
const cors = require('cors');
const db = require('./db');

const path = require('path');


const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const port = process.env.PORT || 3000;
app.use('/uploads', (req, res, next) => {
  console.log('Accès à', req.url)
  next()
});
// Import des routes
const patientsRoutes = require('./routes/patients');
const traitementsRoutes = require('./routes/traitements');
const servicesRoutes = require('./routes/services');

const rdvRoutes = require('./routes/rendezVous');
const schemaDentaireRoutes = require('./routes/schema-dentaire');
const medecinsRoutes = require('./routes/medecins');
const allergiesRoutes = require('./routes/allergies');
const facturesRoutes = require('./routes/factures');

const authRoutes = require('./routes/authRoutes');

const medicamentsRoutes = require('./routes/medicaments');
const ordonnancesRoutes = require('./routes/ordonnances');
const certificatsRoutes = require('./routes/certificats');
const stockRoutes = require('./routes/stockRoutes');




// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/patients', patientsRoutes);
app.use('/api/traitements', traitementsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/rendez-vous', rdvRoutes);
app.use('/api/schema-dentaire', schemaDentaireRoutes);
console.log('✅ Routes /api/schema-dentaire montées')

app.use('/api/medecins', medecinsRoutes);
app.use('/api/allergies', allergiesRoutes);
app.use('/api/factures', facturesRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/medicaments', medicamentsRoutes);
app.use('/api/ordonnances', ordonnancesRoutes);
app.use('/api/certificats', certificatsRoutes);
app.use('/api/stock', stockRoutes);




// app.use('/uploads/schemas', express.static(path.join(__dirname, 'uploads/schemas')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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
