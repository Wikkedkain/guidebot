const snekfetch = require('snekfetch');

exports.run = (client, message, args) => {
  let searchTerms = args.filter((a) => a.indexOf("<@") < 0).join("+");
  
  let users = message.mentions.users;
  
  client.logger.debug(`'${searchTerms}'`, `${users.array().join(', ')}`);
  let API_KEY = client.config.gifKey;
  const url = searchTerms.length > 0 ? `http://api.giphy.com/v1/gifs/translate?s=${encodeURIComponent(searchTerms)}&api_key=${API_KEY}` : `http://api.giphy.com/v1/gifs/random?rating=pg-13&api_key=${API_KEY}`;
  
  snekfetch.get(url).then((r)=>{
    message.channel.send(users.array().join(", ") + " " + r.body.data.url);
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
