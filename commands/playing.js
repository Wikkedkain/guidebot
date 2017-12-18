exports.run = (client, message, args) => {
  let game = args.join(" ").trim();
  if(!game || game.length < 1) game = null;
  if(message.flags[0] === "help") game = message.settings.prefix + "help";
  client.user.setPresence({ game: { name: game, type: 0 } });
  
  if(!!message.guild) {
    message.delete().catch(console.error);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["game"],
  permLevel: "Administrator"
};

exports.help = {
  name: "playing",
  category: "Miscellaneous",
  description: "Changes the 'Playing' status (game).",
  usage: "playing <game name>"
};
