const express = require('express');
const router = express.Router();
const medecinsCtrl = require('../controllers/medecinsController');

router.get('/', medecinsCtrl.getAllMedecins);
router.get('/:id', medecinsCtrl.getMedecinById);
router.post('/', medecinsCtrl.createMedecin);
router.put('/:id', medecinsCtrl.updateMedecin);
router.delete('/:id', medecinsCtrl.deleteMedecin);

module.exports = router;
