const {log,info} = require('../utils/logger')
const risk_bll = require('../bll/risk.bll');
const validator = require('../middleware/validator');

exports.riskAnalysis = (req, res) => {
    log.info("riskAnalysis : req.body " + JSON.stringify(req.body))
    let validationErr = validator.validateRequest(req, res);
    if(validationErr.length > 0) {
        return res.status(400).send(validationErr[0])
    }
    let result = risk_bll.riskAnalysisBll(req.body);
    log.info(JSON.stringify(result));
    if(result){
        res.status(200).send(result);
    } else {
        res.status(500).send("Something went wrong");
    }
}