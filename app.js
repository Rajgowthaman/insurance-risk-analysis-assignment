const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { log, setRequestId } = require('./src/utils/logger');
const risk_route = require('./src/routes/risk.routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("*",setRequestId);
app.use("/risk", risk_route)

app.listen(9910, () => {
    log.info('App started on port 9910');
});