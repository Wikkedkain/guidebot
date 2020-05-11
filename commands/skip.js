const MusicPlayer = require("../modules/MusicPlayer");

exports.run = (client, message, args) => {
  let musicPlayer = MusicPlayer.getInstance(message.guild, client.logger);
  
  musicPlayer.skipSong();
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "skip",
  category: "Music",
  description: "Skip the current song in the queue.",
  usage: "skip"
};
