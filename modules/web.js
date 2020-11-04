const express = require("express");
const helmet = require('helmet');
const handleErrors = require('./handleErrors');
const { NotFound, BadRequest } = require('./webErrors');
const crypto = require('crypto');
const session = require('express-session');
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
    clientId: "180922528338804736",
    clientSecret: "F98td93I1GyznSrZitnIjtvIWKz7id27",
    redirectUri: "http://localhost:5000/servers"
});
const app = express();
const path = require('path');
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const logger = require("./Logger");
const TWELVE_HOURS = 60 * 60 * 12;

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

function dateDiffInSeconds(d1, d2) {
    return Math.abs((d2.getTime()-d1.getTime())/1000);
}

function tokenIsExpiringWithin(dateExpires, thresholdInSeconds) {
    if(dateExpires == null) return true;
    let diff = dateDiffInSeconds(new Date(), new Date(dateExpires));
    return diff <= thresholdInSeconds;
}

const init = async () => {
    //app.use(helmet()); // todo: re-enable this later but CSP is a problem

    app.use(session({
        secret: 'alskdjflkj34lkj',
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
        }
    }));

    // application-level oauth
    app.use(async (request, response, next) => {
        if(request.query.code) {
            console.log('request oauth token');
            const data = await oauth.tokenRequest({
                code: request.query.code,
                scope: "identify guilds",
                grantType: "authorization_code",
            });
            request.session.oauth = data;
            request.session.oauth.date_expires = Date.now() + (data.expires_in * 1000);
        } else if(request.session.oauth != null && request.session.oauth.date_expires != null
            && tokenIsExpiringWithin(request.session.oauth.date_expires, TWELVE_HOURS)) {
            console.log('refresh oauth token');
            const data = await oauth.tokenRequest({
                refreshToken: request.session.oauth.refresh_token,
                scope: 'identify guilds',
                grantType: 'refresh_token'
            });
            request.session.oauth = data;
            request.session.oauth.date_expires = Date.now() + (data.expires_in * 1000);
        }
        //response.setHeader('Content-Security-Policy', "script-src 'unsafe-inline' 'unsafe-eval' 'self' http:; default-src 'self' * 127.0.0.1; object-src 'none'; img-src https://cdn.discordapp.com 'self'");
        response.cookie('isAuthenticated', request.session.oauth != null, { maxAge: 24 * 60 * 60 * 1000 });

        //console.log(request.url, 'sid', request.session.id, 'oauth', request.session.oauth);
        next();
    });

    // make express look in the `public` directory for assets (css/js/img)
    app.use(express.static(process.cwd() + '/public'));

    
    let commands = await getCommands();
    // commands api
    app.get('/api/commands', (request, response) => {
        response.send(commands);
    });

    // discord api - user servers
    app.get('/api/servers/:id?', async (request, response, next) => {
        try {
            if(request.session.oauth == null) throw new BadRequest('Unauthorized request. Must login with Discord.');

            let guilds = await oauth.getUserGuilds(request.session.oauth.access_token);
            if(request.params.id) {
                return response.send(guilds.find(g => g.id == request.params.id));
            }
            response.send(guilds);
        }
        catch(err) {
            next(err);
        }
    });

    // discord - api user
    app.get('/api/user', async (request, response, next) => {
        try { 
            if(request.session.oauth == null) throw new BadRequest('Unauthorized request. Must login with Discord.');
            let user = await oauth.getUser(request.session.oauth.access_token);
            response.send(user);
        }
        catch(err) {
            next(err);
        }
    });

    app.get('/login', (request, response) => {
        if(request.session.oauth != null) return; // don't login twice
        response.redirect(oauth.generateAuthUrl({
            scope: ['identify', 'guilds'],
            state: crypto.randomBytes(16).toString('hex')
        }));
    });

    app.get('/logout', (request, response) => {
        request.session.oauth = null;
        response.cookie('isAuthenticated', false, { maxAge: 24 * 60 * 60 * 1000 });
        response.redirect('/');
    });

    // SPA - no SSR
    app.get('/*', (request, response) => {
        response.sendFile(path.resolve(process.cwd(), 'public/index.html'));
    });

    app.use(handleErrors);
    
    // start listening
    app.listen(port, () => {
        logger.log('Our app is running on http://localhost:' + port);
    });
};

module.exports = {
  init: init,
};