

exports.run = (client, message, args) => {
  const cmd = client.commands.get("gif");
  message.flags = ["reroll"];
  return cmd.run(client, message, args);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "reroll",
  category: "Fun",
  description: "Re-roll for a random GIF (using Giphy) to the channel (text based search)",
  usage: "reroll"
};