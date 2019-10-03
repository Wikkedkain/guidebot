const Discord = require("discord.js");

exports.run = (client, message, args) => {
  if(!!message.guild) {
    message.delete().catch(err => client.logger.error(err));
  }
  const embed = new Discord.RichEmbed()
    .setDescription(args.join(" "))
    .setColor([114, 137, 218]);
  message.channel.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [">"],
  permLevel: "User"
};

exports.help = {
  name: "embed",
  category: "Miscellaneous",
  description: "Embeds some text.",
  usage: "> Embed Text"
};
