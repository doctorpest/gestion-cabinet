const express = require('express');
const router = express.Router();
const servicesCtrl = require('../controllers/servicesController');

router.get('/', servicesCtrl.getAllServices);
router.post('/', servicesCtrl.createService);
router.put('/:id', servicesCtrl.updateService);
router.delete('/:id', servicesCtrl.deleteService);

module.exports = router;
