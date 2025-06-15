const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/medicamentsController');

router.get('/', ctrl.getMedicaments);
router.post('/', ctrl.addMedicament);

module.exports = router;
