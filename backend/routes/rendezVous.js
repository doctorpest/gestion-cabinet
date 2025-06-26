const express = require('express');
const router = express.Router();
const controller = require('../controllers/rendezVousController');

router.get('/', controller.getAllRendezVous);
router.post('/', controller.ajouterRendezVous);
router.patch('/update-statut-passes',controller.mettreAJourStatutsPasses);
router.put('/:id', controller.modifierRendezVous);
router.delete('/:id', controller.supprimerRendezVous);

module.exports = router;
