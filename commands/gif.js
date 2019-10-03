const snekfetch = require("snekfetch");
let token = {};
const limit = 10;

async function getAccessToken(client) {
  let CLIENT_ID = client.config.gfycatSecrets.client_id;
  let CLIENT_SECRET = client.config.gfycatSecrets.client_secret;
  
  if(token.access_token != null) {
    let expireDate = new Date(token.time);
    expireDate.setSeconds(token.time.getSeconds() + token.expires_in);
    
    if(Date.parse(new Date()) > Date.parse(expireDate)) {
      client.logger.debug(`Gfy access token expired.`);
  	  token = {};
    }
  }
  
  if (token.access_token == null) {
    await snekfetch.post("https://api.gfycat.com/v1/oauth/token")
      .send({ grant_type: "client_credentials", client_id: CLIENT_ID, client_secret: CLIENT_SECRET })
      .then((r) => {
        token.token_type = r.body.token_type;
        token.expires_in = r.body.expires_in;
        token.access_token = r.body.access_token;
        token.time = new Date();
        client.logger.debug('Access token granted for gfy!');
      });
  }
}

function tryDeleteMessage(client, message) {
  if(!!message.guild && message.deletable) {
    message.delete().catch(err => client.logger.error(err));
  }
}

function tryDeleteMessageById(client, channel, messageId) {
  channel.fetchMessage(messageId).then(message => {
    if(message.deletable) {
      message.delete().catch(err => client.logger.error(err));
    }
  });
}

function tryUpdateMessageById(client, channel, messageId, newContent) {
  channel.fetchMessage(messageId).then(message => {
    if(message.editable) {
      message.edit(newContent).catch(err => client.logger.error(err));
    }
  });
}

function saveLastCommand(userId, entry) {
  exports.previous[userId] = entry;
}

function getLastCommand(userId) {
  return exports.previous[userId];
}

exports.run = async (client, message, args) => {
  let searchTerms = args.filter((a) => a.indexOf("<@") < 0).join("+");
  let previous, current;
  
  let users = message.mentions.users;
  
  let API_KEY = client.config.gifKey;
  let url = "http://api.giphy.com/v1/gifs/random?rating=r";
  let options = {headers:{}};
  
  if(message.content.indexOf("rmgif") > -1) message.flags.push("remove");
  if(message.content.indexOf("gfy") > -1) message.flags.push("gfycat");
  if(message.content.indexOf("reroll") > -1 || message.content.indexOf("regif") > -1) message.flags.push("reroll");
  if(message.content.indexOf("sgif") > -1) message.flags.push("search");
  
  if(searchTerms.length > 0 || message.flags.length > 0) {
    if(message.flags.length == 0) message.flags.push("translate"); // default to translate
    
    switch(message.flags[0]) {
      case ("gfycat"):
        url = `https://api.gfycat.com/v1/gfycats/search?search_text=${searchTerms}&gfyCount=${limit}`;
        break;
      case ("search"):
        url = `http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(searchTerms)}&limit=${limit}`;
        break;
      case ("translate"):
        url = `http://api.giphy.com/v1/gifs/translate?s=${encodeURIComponent(searchTerms)}`;
        break;
      case ("reroll"):
        previous = getLastCommand(message.author.id);
        if (previous != null) {
          users = previous.users;
          url = previous.url;
          options = previous.options;
        }
        break;
      case ("remove"):
        previous = getLastCommand(message.author.id);
        tryDeleteMessage(client, message);
        tryDeleteMessageById(client, message.channel, previous.id);
        saveLastCommand(message.author.id, null);
        return;
    }
  }
  if(url.indexOf("gfycat") > -1) {
    await getAccessToken(client);
    options.headers.Authorization = "Bearer " + token.access_token;
  }
  current = {url: url, users: users, options: options};
  tryDeleteMessage(client, message);
  
  snekfetch.get(url + `&api_key=${API_KEY}`, options)
    .then((r) => {
      let gif;
      if(url.indexOf("gfycat") > -1) {
        gif = r.body.gfycats.random().mp4Url;
      }
      else {
        let data = r.body.data;
      
        if(Array.isArray(data)) {
          data = data.random();
        }
        gif = data.images.original.mp4;
      }
      
      let text = `${users.array().join(", ")} ${gif}`;
      if(previous != null) {
        tryUpdateMessageById(client, message.channel, previous.id, text);
      }
      else {
        message.channel.send(text)
          .then((newMessage) => {
            current.id = newMessage.id;
            saveLastCommand(message.author.id, current);
          });
      }
    })
    .catch((err) => {
      client.logger.error(url, err);
      message.reply("I failed to find a GIF for you :(");
    });
};

exports.previous = {};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["giphy","gifs", "sgif","gfy", "regif", "rmgif"],
  permLevel: "User"
};

exports.help = {
  name: "gif",
  category: "Fun",
  description: "Send a random GIF from Giphy or Gfycat to the channel (text based search or random gif).",
  usage: "gif\ngif [text]\ngfy [text]\nsgif [text]\nregif\nrmgif\n\nFlags (shorthand):\n-translate: Convert words and phrases to GIFs.\n-search (sgif): Search for a GIF by text.\n-reroll (regif): Re-roll the last gif command.\n-remove (rmgif): Remove the last gif command.\n\n*if no flags are specified will default to -translate\n"
};
