const MusicPlayer = require("../modules/MusicPlayer");

exports.run = (client, message, args) => {
  let musicPlayer = MusicPlayer.getInstance(message.guild, client.logger);
  
  musicPlayer.pause();
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "pause",
  category: "Music",
  description: "Pause the music.",
  usage: "pause"
};