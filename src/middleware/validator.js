const { log } = require('../utils/logger');
const accepted_marital_status = ["married", "single"];
const accepted_house_ownership_status = ["owned", "mortgaged"];
const { body, validationResult } = require('express-validator');

exports.validateRiskAlgorithmReq = (req, res, next) => {
    let validationRules = [
        body('age').exists().withMessage("required field"),
        body('age').isInt({ min: 0 }).withMessage("should be greater than or equal to 0"),
        body('age').not().isString().withMessage("cannot be a string. Number is expected"),

        body('dependents').exists().withMessage("required field"),
        body('dependents').isInt({ min: 0 }).withMessage("should be greater than or equal to 0"),
        body('dependents').not().isString().withMessage("cannot be a string. Number is expected"),

        body('income').exists().withMessage("required field"),
        body('income').isInt({ min: 0 }).withMessage("should be greater than or equal to 0"),
        body('income').not().isString().withMessage("cannot be a string. Number is expected"),

        body('marital_status').exists().withMessage("required field"),
        body('marital_status').trim().escape().isIn(accepted_marital_status).withMessage(`allowed 'marital_status' values [${accepted_marital_status}]`),
        
        body('risk_questions').exists().withMessage("required field"),
        body('risk_questions').custom((value, { req }) => {
            if (!Array.isArray((value))) {
                throw new Error('should be an array of 3 booleans(0 and 1)');
            } else {
                if (value.length != 3) {
                    throw new Error('should be an array of 3 booleans(0 and 1)');
                } else {
                    value.forEach(v => {
                        if (v !== 1 && v !== 0) {
                            throw new Error("Only booleans(0 and 1) are expected")
                        }
                    })
                }
            }
            return true;
        }),
        body('house').optional().custom((value, { req }) => {
            if (value) {
                if (value.ownership_status && accepted_house_ownership_status.includes(value.ownership_status)) {
                    return true;
                } else {
                    throw new Error('house.ownership_status should be anyone of ["owned","mortgaged"]');
                }
            } else {
                if (value === 0) {
                    return true;
                } else {
                    throw new Error('house can either be 0 or should have "ownership_status" attribute');
                }
            }
        }),
        body('vehicle').optional().custom((value, { req }) => {
            if (value) {
                if (value.year && typeof(value.year) === 'number' && value.year > 0) {
                    return true;
                } else {
                    throw new Error('vehicle should have the attribute "year", it should be of type "number" and a positive integer');
                }
            } else {
                if (value === 0) {
                    return true;
                } else {
                    throw new Error('vehicle can either be 0 or should have "year" attribute');
                }
            }
        })
    ];
    return validationRules;
}

exports.validateRequest = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.error("Validation failed :: " + errors.array());
        return errors.array();
    }
    return [];
}