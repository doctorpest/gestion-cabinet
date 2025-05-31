const express = require('express');
const router = express.Router();
const allergiesCtrl = require('../controllers/allergiesController');

router.get('/patient/:patientId', allergiesCtrl.getAllAllergiesByPatient);
router.post('/', allergiesCtrl.createAllergy);
router.put('/:id', allergiesCtrl.updateAllergy);
router.delete('/:id', allergiesCtrl.deleteAllergy);

module.exports = router;
