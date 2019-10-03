let connection;

exports.run = (client, message, args) => {
  if(message.guild.voiceConnection && message.guild.voiceConnection.channel) {
      return message.reply(`Already connected to ${message.guild.voiceChannel.name}`);
  }
  const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply("I couldn't connect to your voice channel...");
	
  voiceChannel.join().then((conn) => {connection = conn;}).catch(err => client.logger.error(err));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "join",
  category: "Music",
  description: "Join the user's voice channel. User must be currently in a voice channel.",
  usage: "join"
};
