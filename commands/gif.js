const snekfetch = require("snekfetch");
const limit = 10;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function tryDeleteMessage(client, message) {
  if(!!message.guild && message.deletable) {
      message.delete().catch(client.logger.error);
    }
}

exports.run = (client, message, args) => {
  let searchTerms = args.filter((a) => a.indexOf("<@") < 0).join("+");
  
  let users = message.mentions.users;
  
  let API_KEY = client.config.gifKey;
  let url = "http://api.giphy.com/v1/gifs/random?rating=r";
  
  if(searchTerms.length > 0) {
    if(message.flags.length == 0) message.flags.push("translate"); // default to translate
    
    switch(message.flags[0]) {
      case ("search"):
        url = `http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(searchTerms)}&limit=${limit}`;
        break;
      case ("translate"):
        url = `http://api.giphy.com/v1/gifs/translate?s=${encodeURIComponent(searchTerms)}`;
        break;
    }
  }
  client.logger.debug(`${url}`, `${users.array().join(', ')}`);
  
  snekfetch.get(url + `&api_key=${API_KEY}`)
    .then((r)=>{
      let data = r.body.data;
      client.logger.debug(JSON.stringify(data));
      if(Array.isArray(data)) {
        let index = getRandomInt(0, data.length);
        data = data[index];
      }
      let gif = data.images.original.mp4;
      message.channel.send(users.array().join(", ") + " " + gif)
        .then(() => {
          tryDeleteMessage(client, message);
        });
    })
    .catch((err) => {
      client.logger.error(err);
      message.reply("Failed to find gif.")
        .then(() => {
          tryDeleteMessage(client, message);
        });
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["giphy"],
  permLevel: "User"
};

exports.help = {
  name: "gif",
  category: "Fun",
  description: "Send a GIF (using Giphy) to the channel (text based search)",
  usage: "gif\ngif <text>\n\nFlags:\n-translate: Convert words and phrases to GIFs.\n-search: Search for a GIF by text.\n\n*if no flags are specified will default to -translate\n"
};
