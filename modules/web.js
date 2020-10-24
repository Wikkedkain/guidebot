const express = require("express");
const app = express();
const path = require('path');
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const logger = require("./Logger");

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

const getCommand = (commandName) => {
    try {
      return require(`../commands/${commandName}`);
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
    app.use(express.static(process.cwd() + '/public'));
    
    let commands = await getCommands();
    // commands api
    app.get('/api/commands', (request, response) => {
        response.send(commands);
    });

    // SPA - no SSR
    app.get('/*', (request, response) => {
        response.sendFile(path.resolve(process.cwd(), 'public/index.html'));
    });
    
    // start listening
    app.listen(port, () => {
        logger.log('Our app is running on http://localhost:' + port);
    });
};

module.exports = {
  init: init,
};