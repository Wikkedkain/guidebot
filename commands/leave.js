const MusicPlayer = require("../modules/MusicPlayer");

exports.run = (client, message, args) => {
  let musicPlayer = MusicPlayer.getInstance(message.guild, client.logger);
  
  musicPlayer.leave();
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "leave",
  category: "Music",
  description: "Leave the current voice channel.",
  usage: "leave"
};
