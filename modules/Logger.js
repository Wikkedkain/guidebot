/*
Logger class for easy and aesthetically pleasing console logging 
*/
const chalk = require("chalk");
const moment = require("moment");

function log(type, ...args) {
  const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
  switch (type) {
    case "log": {
      return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${args.join(", ")} `);
    }
    case "warn": {
      return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${args.join(", ")} `);
    }
    case "error": {
      return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${args.join(", ")} `);
    }
    case "debug": {
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${args.join(", ")} `);
    }
    case "cmd": {
      return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${args.join(", ")}`);
    }
    case "ready": {
      return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${args.join(", ")}`);
    }
    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
}

exports.log = (...args) => log("log", ...args);

exports.error = (...args) => log("error", ...args);

exports.warn = (...args) => log("warn", ...args);

exports.debug = (...args) => log("debug", ...args);

exports.cmd = (...args) => log("cmd", ...args);

exports.ready = (...args) => log("ready", ...args);