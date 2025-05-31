const express = require('express');
const router = express.Router();
const controller = require('../controllers/schemaDentaireController');

router.post('/', controller.creerOuMettreAJourSchema); // Create or update

module.exports = router;
