const snekfetch = require('snekfetch');

exports.run = (client, message, args) => {
  let [title, contents] = args.filter((a) => a.indexOf("<@") < 0).join(" ").split("|");
  client.logger.debug(`${title}, ${contents}`);
  if(!contents) {
    [title, contents] = ["Achievement Get!", title];
  }
  let rnd = Math.floor((Math.random() * 39) + 1);
  if(args.join(" ").toLowerCase().includes("burn")) rnd = 38;
  if(args.join(" ").toLowerCase().includes("cookie")) rnd = 21;
  if(args.join(" ").toLowerCase().includes("cake")) rnd = 10;
  
  let users = message.mentions.users;

  if(title.length > 22 || contents.length > 22) return message.reply("Achievement title and content cannot exceed 22 characters each.").then(message.delete.bind(message), 3000);
  const url = `https://www.minecraftskinstealer.com/achievement/a.php?i=${rnd}&h=${encodeURIComponent(title)}&t=${encodeURIComponent(contents)}`;
  snekfetch.get(url).then(r=>message.channel.send(users.array().join(", "), {files:[{attachment: r.body}]})).then(() => {
    if(!!message.guild && message.deletable) {
      message.delete().catch(client.logger.error);
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["mca"],
  permLevel: "User"
};

exports.help = {
  name: "achievement",
  category: "Miscellaneous",
  description: "Send a Minecraft Achievement image to the channel",
  usage: "achievement Title|Text (/achievement Achievement Get|Used a Command!)"
};
