const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotation.controller');

router.post('/quotations', quotationController.createQuotation);

module.exports = router;
  