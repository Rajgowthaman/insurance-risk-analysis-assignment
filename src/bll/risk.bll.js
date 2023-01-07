const { log } = require('../utils/logger');
const moment = require('moment');

exports.riskAnalysisBll = (risk_attributes) => {
    try {

        let base_points = 0;
        risk_attributes.risk_questions.forEach(rq => {
            base_points = base_points + rq;
        });

        let eligibility = {};
        let risk_points = {
            "auto": base_points,
            "disability": base_points,
            "home": base_points,
            "life": base_points
        }

        if (risk_attributes.income === 0) {
            eligibility.disability = "ineligible";
        }
        if (risk_attributes.house === 0) {
            eligibility.home = "ineligible";
        }
        if (risk_attributes.vehicle === 0) {
            eligibility.auto = "ineligible";
        }

        if (risk_attributes.age > 60) {
            eligibility.disability = "ineligible";
            eligibility.life = "ineligible";
        }

        if (eligibility.auto === "ineligible" && eligibility.disability === "ineligible" && eligibility.home === "ineligible" && eligibility.life === "ineligible") {
            return {
                "auto": "ineligible",
                "disability": "ineligible",
                "home": "ineligible",
                "life": "ineligible"
            }; 
        }

        if (risk_attributes.age < 30) {
            risk_points.auto = risk_points.auto - 2;
            risk_points.home = risk_points.home - 2;
            risk_points.life = risk_points.life - 2;
            risk_points.disability = risk_points.disability - 2;
        }
        if (risk_attributes.age >= 30 && risk_attributes.age <= 40) {
            risk_points.auto = risk_points.auto - 1;
            risk_points.home = risk_points.home - 1;
            risk_points.life = risk_points.life - 1;
            risk_points.disability = risk_points.disability - 1;
        }

        if (risk_attributes.income > 200000) {
            risk_points.auto = risk_points.auto - 1;
            risk_points.home = risk_points.home - 1;
            risk_points.life = risk_points.life - 1;
            risk_points.disability = risk_points.disability - 1;
        }

        if (risk_attributes.house && risk_attributes.house.ownership_status === 'mortgaged') {
            risk_points.home = risk_points.home + 1;
            risk_points.disability = risk_points.disability + 1;
        }

        if (risk_attributes.dependents > 0) {
            risk_points.life = risk_points.life + 1;
            risk_points.disability = risk_points.disability + 1;
        }

        if (risk_attributes.marital_status === 'married') {
            risk_points.life = risk_points.life + 1;
            risk_points.disability = risk_points.disability - 1;
        }

        log.info(moment().year() - risk_attributes.vehicle.year + ' year(s) old vehicle');
        if (risk_attributes.vehicle && moment().year() - risk_attributes.vehicle.year <= 5) {
            risk_points.auto = risk_points.auto + 1;
        }

        log.info(JSON.stringify(risk_points));
        return {
            "auto": eligibility.auto || getStatus(risk_points.auto),
            "disability": eligibility.disability || getStatus(risk_points.disability),
            "home": eligibility.home || getStatus(risk_points.home),
            "life": eligibility.life || getStatus(risk_points.life)
        };
    }
    catch (e) {
        log.error("Error: " + e);
        return null;
    }
}

function getStatus(score) {
    if (score <= 0) {
        return "economic";
    }
    if (score >= 3) {
        return "responsible"
    } else {
        return "regular"
    }
}