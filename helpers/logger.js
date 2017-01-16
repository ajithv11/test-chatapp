
var winston = require('winston');
var fs = require('fs');
var env = process.env.NODE_ENV || 'development';
var logDir = 'logs';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
var tsFormat = () => (new Date()).toLocaleTimeString();
var logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info'
    })
  ]
});

module.exports = logger;



/*logger.debug('Debugging info');
logger.verbose('Verbose info');
logger.info('Hello world');
logger.warn('Warning message');
logger.error('Error info');*/