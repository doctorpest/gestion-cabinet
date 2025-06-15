const express = require('express');
const router = express.Router();


const ordonnanceController = require('../controllers/ordonnancesController');
console.log('ordonnanceController:', ordonnanceController);
router.post('/', ordonnanceController.create);
router.post('/medicaments', ordonnanceController.addMedicament);
router.get('/medicaments', ordonnanceController.getMedicaments);

module.exports = router;
