const MusicPlayer = require("../modules/MusicPlayer");

exports.run = async (client, message, [songUrl, ...args]) => {
  let musicPlayer = MusicPlayer.getInstance(message.guild, client.logger);
  
  try {
    if(songUrl) { // add song if provided
      musicPlayer.addSong(songUrl);
      client.logger.debug(`Song ${songUrl} added to queue.`);
    }
    
    if(!musicPlayer.isVoiceConnected()) { // join voice if not already
      musicPlayer.join(message.member.voiceChannel.id);
    }
    
    musicPlayer.play();
    return message.reply(`**Playing music.**`);
  } catch(err) {
    client.logger.error(err);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["resume"],
  permLevel: "Bot Support"
};

exports.help = {
  name: "play",
  category: "Music",
  description: "Play music from the queue in the voice channel. Can provide a song to be played immediately.",
  usage: "play\nplay <url>"
};
