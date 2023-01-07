const express = require('express');
const router = express.Router();
const risk_controller = require('../controller/risk.controller');
const validation_middle_ware = require('../middleware/validator');

router.post('/analysis', validation_middle_ware.validateRiskAlgorithmReq(), risk_controller.riskAnalysis);

module.exports = router;