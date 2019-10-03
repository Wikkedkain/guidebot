const Enmap = require("enmap");
const EnmapPostgres = require("../modules/enmap-postgres");
let insultsMap;

let urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

function escapeUrls(str) {
  return str.replace(urlRegex, (url) => `<${url}>`);
}

exports.run = (client, message, args, level) => {
  const insults = insultsMap.get(message.guild.id) || [];
  
  let keywords = ["add", "list", "empty"];
  for(var i in keywords) {
    if(args[0] === keywords[i]) {
      args = args.slice(1);
      message.flags.push(keywords[i]);
      break;
    }
  }
  
  switch(message.flags[0]) {
    case ("add") : // Add a new insult to the collection
        let insult = args.join(" ").replaceAll("\"", "");
        insults.push(insult);
        insultsMap.set(message.guild.id, insults); // put back into the map store
        
        let urlInsult = escapeUrls(insult);
        if(message.editable) {
          message.edit(message.content.replace(insult, urlInsult)).catch(err => client.logger.error(err));
        }
        insult = urlInsult;
        
        return message.reply(`Adding insult "${insult}" to the collection`);
    case ("empty") : // Empty the collection
        const level = message.author.permLevel;
        let adminLevel = client.levelCache["Administrator"];
        if(level < client.levelCache["Administrator"]) {
            return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${adminLevel} (Administrator)`);
        }
        else {
          insultsMap.set(message.guild.id, []); // empty the insults collection
          return message.reply("Insult collection has been emptied.");
        }
    case "list" : // List the current collection
        return message.reply('Insults:\n\n' + insults.map((n,i) => {return (i + 1) + '. ' + escapeUrls(n)}).join("\n"));
    default : // Send a random insult!
        let users = message.mentions.users;
        
        if(users.size < 1) return message.reply(insults.random());
        if(insults.length < 1) return message.reply("You must add an insult to the collection before using this command.");
        
        // have a little fun with the caller
        let chance =  Math.floor(Math.random() * 10) + 1;
        if(chance <= 1) {
          client.logger.debug(`${message.author.username} failed to insult someone else.`);
          return message.reply(insults.random());
        }
        
        return message.channel.send(users.array().join(', ') + " " + insults.random());
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["insults"],
  permLevel: "User"
};

exports.init = async () => {
  insultsMap = new Enmap({provider: new EnmapPostgres({name: "insults"})});
};

exports.shutdown = async () => {
  if(insultsMap != undefined) {
    await insultsMap.db.close();
  }
};

exports.help = {
  name: "insult",
  category: "Fun",
  description: "Insults user(s) mentioned (or yourself if no users are mentioned)",
  usage: "\n  insult <@user>\n\n  options:\n 1.-add <insult>\n 2.-list\n 3.-empty (admin only)"
};
