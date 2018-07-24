const snekfetch = require("snekfetch");
let token = {};
const limit = 10;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function getAccessToken(client, CLIENT_ID, CLIENT_SECRET) {
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
      message.delete().catch(client.logger.error);
    }
}

exports.run = async (client, message, args) => {
  let searchTerms = args.filter((a) => a.indexOf("<@") < 0).join("+");
  
  let users = message.mentions.users;
  
  let CLIENT_ID = client.config.gfycatSecrets.client_id;
  let CLIENT_SECRET = client.config.gfycatSecrets.client_secret;
  await getAccessToken(client, CLIENT_ID, CLIENT_SECRET);
  
  let url = "https://api.gfycat.com/v1/reactions/populated?tagName=trending&gfyCount=1";
  
  if(searchTerms.length > 0) {
    if(message.flags.length == 0) message.flags.push("search"); // default to search
    
    switch(message.flags[0]) {
      case ("search"):
        url = `https://api.gfycat.com/v1/gfycats/search?search_text=${encodeURIComponent(searchTerms)}&gfyCount=${limit}`;
        break;
      case("tag"):
        url = `https://api.gfycat.com/v1/reactions/populated?tagName=${encodeURIComponent(searchTerms)}&gfyCount=1`;
        break;
      case("sticker"):
        url = `https://api.gfycat.com/v1/stickers/search?search_text=${encodeURIComponent(searchTerms)}&count=1`;
        break;
    }
  }
  client.logger.debug("Gfy request", `${url}`, `${users.array().join(', ')}`, `${token.access_token}`);
  
  snekfetch.get(url, {headers: { Authorization: "Bearer " + token.access_token }})
    .then((r) => {
      let index = getRandomInt(0, r.body.gfycats.length);
      let gif = r.body.gfycats[index].mp4Url;
      
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
  aliases: ["gfycat"],
  permLevel: "User"
};

exports.help = {
  name: "gfy",
  category: "Fun",
  description: "Send a GIF (using Gfycat) to the channel (text based search)",
  usage: "gfy\ngfy <text>\ngfycat <text>\n\nFlags:\n-search: Search for a GIF by text.\n-tag: Search for a GIF by tag name.\n-stickers: Search for a sticker by text.\n\n*if no flags are specified will default to -search\n"
};
