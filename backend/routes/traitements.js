const express = require('express');
const router = express.Router();
const controller = require('../controllers/traitementsController');

router.post('/', controller.ajouterTraitement);
router.put('/:id', controller.modifierTraitement);
router.delete('/:id', controller.supprimerTraitement);
router.get('/patient/:patientId', controller.getTraitementsByPatient);


module.exports = router;
