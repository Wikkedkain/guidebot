const MusicPlayer = require("../modules/MusicPlayer");

exports.run = (client, message, args) => {
  let musicPlayer = MusicPlayer.getInstance(message.guild, client.logger);
  
  musicPlayer.join(message.member.voiceChannel.id);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "join",
  category: "Music",
  description: "Join the user's voice channel. User must be in a voice channel.",
  usage: "join"
};
