const snekfetch = require("snekfetch");

exports.run = (client, message, args) => {
  let searchTerms = args.filter((a) => a.indexOf("<@") < 0).join("+");
  
  let users = message.mentions.users;
  
  let API_KEY = client.config.gifKey;
  let url = "http://api.giphy.com/v1/gifs/random?rating=r";
  
  if(searchTerms.length > 0) {
    if(message.flags.length == 0) message.flags.push('search'); // default to search
    
    switch(message.flags[0]) {
      case ("search"):
        url = `http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(searchTerms)}&limit=1`;
        break;
      case ("translate"):
        url = `http://api.giphy.com/v1/gifs/translate?s=${encodeURIComponent(searchTerms)}`;
        break;
    }
  }
  client.logger.debug(`${url}`, `${users.array().join(', ')}`);
  
  snekfetch.get(url + `&api_key=${API_KEY}`).then((r)=>{
    let data = r.body.data;
    if(Array.isArray(data)) data = data[0];
    
    message.channel.send(users.array().join(", ") + " " + data.url);
  }).then(() => {
    if(!!message.guild && message.deletable) {
      message.delete().catch(client.logger.error);
    }
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
  category: "Miscellaneous",
  description: "Send a GIF to the channel (optional or text based search)",
  usage: "gif\ngif <text>"
};
