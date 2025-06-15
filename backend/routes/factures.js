const express = require('express');
const router = express.Router();
const facturesCtrl = require('../controllers/facturesController');

router.get('/patient/:patientId', facturesCtrl.getAllFacturesByPatient);
router.post('/', facturesCtrl.createFacture);
router.put('/:id', facturesCtrl.updateFacture);

router.get('/patient/:patientId/totals', facturesCtrl.getFactureTotalsByPatient);

router.delete('/:id', facturesCtrl.deleteFacture);

module.exports = router;
