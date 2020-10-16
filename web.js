const express = require("express");
const app = express();
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const logger = require("./modules/Logger");
const http = require("http");

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

const getCommand = (commandName) => {
    try {
      return require(`./commands/${commandName}`);
    } catch(e) {
      logger.log(`Unable to load Help for Command: ${commandName} ${e}`);
      return false;
    }
};

const getCommands = async () => {
    // load commands from /commands/*.js
    let commands = [];
    const cmdFiles = await readdir("./commands/");
    
    logger.log('WEB: Loading Help for Command documentation.');
    cmdFiles.forEach(f => {
        if (!f.endsWith(".js")) return;
        const cmd = getCommand(f);
        if (cmd) {
            commands.push(cmd);//logger.log(`Loading Help for Command: ${cmd.help.name}`);
        }
    });
    commands.sort((a,b) => {
       if(a.help.name < b.help.name) return -1;
       if(a.help.name > b.help.name) return 1;
       return 0;
    });
    return commands;
}

const init = async () => {
    // make express look in the `public` directory for assets (css/js/img)
    app.use(express.static(__dirname + '/public'));
    
    let commands = await getCommands();
    // commands api
    app.get('/commands', (request, response) => {
        response.send(commands);
    });
    
    // start listening
    app.listen(port, () => {
        logger.log('Our app is running on http://localhost:' + port);
    });
    
    if(process.env.HEROKU_WEB_URL != null) {
        // phone home every 20 minutes to avoid heroku timeout
        setInterval(() => {
            http.get(process.env.HEROKU_WEB_URL);
          }, 1200000);
    }
};

init();