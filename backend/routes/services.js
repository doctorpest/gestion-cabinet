const express = require('express');
const router = express.Router();

const servicesController = require('../controllers/servicesController');

// Récupérer tous les services à réaliser pour un patient
router.get('/:patientId', servicesController.getServicesByPatient);

// Créer un service à réaliser
router.post('/', servicesController.createServiceARealiser);

// Mettre à jour un service à réaliser
router.put('/:id', servicesController.updateServiceARealiser);

// Supprimer un service à réaliser
router.delete('/:id', servicesController.deleteServiceARealiser);

module.exports = router;
