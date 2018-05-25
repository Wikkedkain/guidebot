/*
Logger class for easy and aesthetically pleasing console logging 
*/
const chalk = require("chalk");
const moment = require("moment");

var log = (type, ...args) => {
  const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
  const content = args.map((a) => typeof(a) === 'object' ? JSON.stringify(a) : a).join(" ");
  
  switch (type) {
    case "log": {
      return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content}`);
    }
    case "warn": {
      return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content}`);
    }
    case "error": {
      return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content}`);
    }
    case "debug": {
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content}`);
    }
    case "cmd": {
      return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
    }
    case "ready": {
      return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
    }
    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
};

exports.log = (...args) => log("log", ...args);

exports.error = (...args) => log("error", ...args);

exports.warn = (...args) => log("warn", ...args);

exports.debug = (...args) => log("debug", ...args);

exports.cmd = (...args) => log("cmd", ...args);
