const snekfetch = require("snekfetch");
let token = {};
const limit = 10;

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
  let url = `https://api.tenor.com/v1/search?q=${encodeURIComponent(searchTerms)}&key=${API_KEY}&contentfilter=low&media_filter=minimal&limit=${limit}`;
  let options = {headers:{}};
  
  if(message.content.indexOf("rmgif") > -1) message.flags.push("remove");
  if(message.content.indexOf("reroll") > -1 || message.content.indexOf("regif") > -1) message.flags.push("reroll");
  
  if(searchTerms.length > 0 || message.flags.length > 0) {
    if(message.flags.length == 0) message.flags.push("search"); // default to search
    
    switch(message.flags[0]) {
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
      default: // search fall through
        break;
    }
  }

  current = {url: url, users: users, options: options};
  tryDeleteMessage(client, message);
  
  snekfetch.get(url, options)
    .then((r) => {
      let gif = r.body.results.random().media[0]['gif'].url;
      
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
  aliases: ["giphy","gifs", "regif", "rmgif"],
  permLevel: "User"
};

exports.help = {
  name: "gif",
  category: "Fun",
  description: "Send a random GIF from Tenor to the channel (text based search or random gif).",
  usage: "gif\ngif [text]\nregif\nrmgif\n\nFlags (shorthand):\n-reroll (regif): Re-roll the last gif command.\n-remove (rmgif): Remove the last gif command."
};
