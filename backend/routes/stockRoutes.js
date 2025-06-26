const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/', stockController.getAllProduits);
router.post('/', stockController.createProduit);
router.put('/:id', stockController.updateProduit);
router.delete('/:id', stockController.deleteProduit);

module.exports = router;
