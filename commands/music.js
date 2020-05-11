const MusicPlayer = require("../modules/MusicPlayer");
const KEYWORDS = ["play", "pause", "resume", "stop", "add", "skip"];

exports.run = (client, message, args) => {
  let musicPlayer = MusicPlayer.getInstance(message.guild, client.logger);
  
  switch(message.flags[0]) {
    case ("play"):
    case ("resume"):
      musicPlayer.play();
      return message.reply("Playing music.");
    case ("pause"):
      musicPlayer.pause();
      return message.reply("Pausing music.");
    case ("stop"):
      return musicPlayer.stop();
    case ("join"):
      return musicPlayer.join(message.member.voiceChannel.id);
    case ("leave"):
      return musicPlayer.leave();
    case ("add"):
      return musicPlayer.addSong(args[0]);
    case ("skip"):
      return musicPlayer.skipSong();
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "music",
  category: "Music",
  description: "Music player command.",
  usage: "Manage the music player.\n\nmusic -play        :: Start playing music from the queue.\nmusic -pause       :: Pause the music.\nmusic -resume      :: Resume the music.\nmusic -stop        :: Stop playing and leave the voice channel.\nmusic -join        :: Join the user's voice channel.\nmusic -leave       :: Leave the voice channel.\nmusic -add <url>   :: Add a song to the queue.\nmusic -skip        :: Skip the current song."
};
