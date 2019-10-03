const snekfetch = require("snekfetch");
let API_KEY;

async function getUser(username) {
  const userUrl = `https://api.twitch.tv/helix/users?login=${username}`;
  const options = {headers: {"Client-ID": API_KEY}};
  let response = await snekfetch.get(userUrl, options);
  
  return response.body.data[0] != null ? response.body.data[0] : null;
}
// uses deprecated Twitch API, will need to update by 12/31/2018
async function findUsers(username) {
  username = encodeURIComponent(username);
  const searchUrl = `https://api.twitch.tv/kraken/search/channels?query=${username}`;
  const options = {headers: {"Client-ID": API_KEY}};
  let response = await snekfetch.get(searchUrl, options);
  
  return response.body;
}
async function displayStream(client, message, user, query) {
  let id = user.id;
  const streamUrl = `https://api.twitch.tv/helix/streams?user_id=${id}`;
  let name = user.display_name;
  const options = {headers: {"Client-ID": API_KEY}};
  
  snekfetch.get(streamUrl, options).then((r) => {
    if(r.body.data.length === 0) {
        message.channel.send(`User ${query} is offline.`);
        return;
    }
    client.logger.debug(r.body);
    let stream = r.body.data[0];
    
    let image = stream.thumbnail_url.replace("{width}x{height}", "320x180");
    let viewerCount = stream.viewer_count;
    let title = stream.title;
    let game = getGame(stream.game_id);
    
    game.then((game) => {
      let gameName = game == null ? 'Unknown' : game.name;
      message.channel.send(`**${name}** is playing **${gameName}**\n_**${title}**_ for __${viewerCount}__ viewers.\n\n(preview)`).then((message) => {
        if(message.editable) {
          message.edit(message.content.replace("(preview)", image)).catch(err => client.logger.error(err));
        }
      });
    });
  }).catch(err => client.logger.error(err));
}
async function getGame(gameId) {
  gameId = encodeURIComponent(gameId);
  const gameUrl = `https://api.twitch.tv/helix/games?id=${gameId}`;
  const options = {headers: {"Client-ID": API_KEY}};
  
  let response = await snekfetch.get(gameUrl, options);
  return response.body.data[0] != null ? response.body.data[0] : null;
}

// allow user to search or preview streamers by name
exports.run = (client, message, args, level) => {
  let keywords = ["search"];
  for(var i in keywords) {
      if(args[0] === keywords[i]){
          args = args.slice(1);
          message.flags.push(keywords[i]);
          break;
      }
  }
  let query = args.filter((a) => a.indexOf("<@") < 0).join("").toLowerCase();
  
  const userUrl = `https://api.twitch.tv/helix/users?login=${query}`;
  
  switch(message.flags[0]) {
    case ("search"):
      let users = findUsers(query);
      users.then((users) => {
          client.logger.debug(users.channels);
          message.reply(`Total users found: ${users._total} for '${query}'. First 10 listed below:`);
          message.channel.send(users.channels.map((c) => `${c.name} - ${c._id}`).join('\n'), {code:"asciidoc"});
      });
      return;
    default: // Check specific user
      let userRequest = getUser(query);
      userRequest.then((user)=> {
          client.logger.debug(query, user);
          if(user != undefined) {
              displayStream(client, message, user, query);
          }
          else {
              message.reply(`User "${query}" does not exist. Try a search instead: '-twitch -search ${query}'`);
          }
      });
      return;
  }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["twitchtv", "twitch.tv"],
    permLevel: "User"
};

exports.init = async (client) => {
  API_KEY = client.config.twitchKey;
}

exports.help = {
    name: "twitch",
    category: "Miscellaneous",
    description: "Search for a twitch user or check if a streamer is live",
    usage: "twitch <user> \n\n twitch -search <user>"
};
