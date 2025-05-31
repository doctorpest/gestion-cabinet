const express = require('express');
const router = express.Router();
const controller = require('../controllers/patientsController');
const { authGuard } = require('../middlewares/auth');

router.get('/', authGuard,controller.getAllPatients);
router.get('/:id', controller.getPatientById);
router.post('/', controller.createPatient);
router.put('/:id', controller.updatePatient);
router.delete('/:id', controller.deletePatient);

module.exports = router;
