const express = require('express');
const router = express.Router();
const controller = require('../controllers/schemaDentaireController');


//router.post('/', controller.creerOuMettreAJourSchema); // Create or update
router.post('/upload/schema', controller.uploadSchema)
router.get('/patient/:patientId',controller.getSchemaByPatient)


module.exports = router;
