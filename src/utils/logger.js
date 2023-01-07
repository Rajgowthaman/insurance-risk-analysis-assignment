//import {createLogger, format, transports} from "winston";
//import DailyRotateFile from "winston-daily-rotate-file";
const winston = require('winston');
const {createLogger, format, transports} = require('winston');
require('winston-daily-rotate-file');

const {
    printf
} = format;

//import moment = require("moment");
const moment = require('moment');
//import {NextFunction, Request, Response} from "express";

let reqID = "";
exports.setRequestId = (req,res,next) => {
    if(Object.entries(res.locals).length === 0){
        res.locals.id = Math.floor(Math.random() * Math.floor(100000000000)).toString();
        reqID = 'req_'+res.locals.id;
    }
    next();
};
const myFormat = printf(({level, message, timestamp}) => {
    return `${moment(timestamp).format("YYYY-MM-DD HH:mm:ss")} :: [${reqID}] ::${level.toUpperCase()}: ${message}`;
});

// instantiate a new Winston Logger with the settings defined above
var transport = new winston.transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  dirname: "./src/logs"
});
exports.log = createLogger({
  level: 'info',
  format: format.combine(myFormat),
  transports: [
      transport,
      new transports.Console({
          handleExceptions: false
      })
  ],
  exitOnError: false, // do not exit on handled exceptions
});