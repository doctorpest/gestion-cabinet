const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/certificatsController');

router.post('/', ctrl.createCertificat);

module.exports = router;
