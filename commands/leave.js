
exports.run = (client, message, args) => {
  if(!message.guild.voiceConnection) {
    return message.reply("Not connected to any voice channel.");
  }
  
  message.guild.voiceConnection.channel.leave();
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "leave",
  category: "Music",
  description: "Leave the current voice channel. Bot must be currently in a voice channel.",
  usage: "leave"
};
