const memes = require("../data/memes").memes;
const MAX_MEME_PER_MESSAGE=30;

exports.run = (client, message, args) => {
  let response = [];
  for(var m in memes)
    response.push(`**\`${m}\`**: ${memes[m]}`);
    
  let count = Math.ceil(response.length/MAX_MEME_PER_MESSAGE);
  for(var i=0;i<count;i++) {
    message.reply((i === 0 ? "Memes list:\n\n" : "") + response.slice(i*MAX_MEME_PER_MESSAGE, (i+1)*MAX_MEME_PER_MESSAGE).join("\n"));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["memeslist"],
  permLevel: "User"
};

exports.help = {
  name: "memelist",
  category: "Fun",
  description: "Display a list of all saved memes.",
  usage: "memelist\nmemes list"
};