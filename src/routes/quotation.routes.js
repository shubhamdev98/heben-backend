const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotation.controller');

router.post('/quotations', quotationController.createQuotation);
router.get('/quotations', quotationController.getAllQuotations);
router.get('/quotations/:id', quotationController.getQuotationById);
router.put('/quotations/:id', quotationController.updateQuotation);
router.delete('/quotations/:id', quotationController.deleteQuotation);

module.exports = router;
  