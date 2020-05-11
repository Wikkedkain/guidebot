const MusicPlayer = require("../modules/MusicPlayer");

exports.run = (client, message, args) => {
  let musicPlayer = MusicPlayer.getInstance(message.guild, client.logger);
  
  musicPlayer.stop();
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "stop",
  category: "Music",
  description: "Stop playing music and leave voice channel.",
  usage: "stop"
};