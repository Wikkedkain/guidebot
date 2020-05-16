const DbMap = require("../modules/dbmap");
let insultsMap;

function saveInsults(id, insults) {
  insultsMap.set(id, insults);
}

function getInsults(id) {
  return insultsMap.get(id);
}

function parseFlags(message, args) {
  let myArgs = args.slice(0);
  let keywords = ["add", "list", "empty"];
  for(var i in keywords) {
    if(myArgs[0] === keywords[i]) {
      myArgs = myArgs.slice(1);
      message.flags.push(keywords[i]);
      break;
    }
  }
  return myArgs;
}

exports.run = async (client, message, args, level) => {
  const id = message.guild.id;
  const insults = getInsults(message.guild.id);
  
  let parsedArgs = parseFlags(message, args);
  
  switch(message.flags[0]) {
    case ("add") : // Add a new insult to the collection
        let insult = parsedArgs.join(" ").replaceAll("\"", "");
        
        insults.push(insult);
        saveInsults(id, insults);
        
        // escape original message?
        let urlInsult = insult.escapeUrl();
        if(message.editable) {
          message.edit(message.content.replace(insult, urlInsult)).catch(err => client.logger.error(err));
        }
        insult = urlInsult; // save escaped version for reply
        
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
          saveInsults(id, []); // empty the insults collection
          return message.reply("Insult collection has been emptied.");
        }
    case "list" : // List the current collection
        return message.reply("Insults:\n\n" + insults.map((n,i) => {return (i + 1) + ". " + escapeUrls(n)}).join("\n"));
    default : // Send a random insult!
        if(insults.length < 1) return message.reply("You must add an insult to the collection before using this command.");
        let users = message.mentions.users;
        if(users.size < 1) return message.reply(insults.random());
        
        // have a little fun with the caller
        let chance =  Math.floor(Math.random() * 10) + 1;
        if(chance <= 1) {
          client.logger.debug(`${message.author.username} failed to insult someone else.`);
          return message.reply(insults.random());
        }
        
        return message.channel.send(users.array().join(", ") + " " + insults.random());
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["insults"],
  permLevel: "User"
};

exports.init = async () => {
  insultsMap = new DbMap("insults");
};

exports.help = {
  name: "insult",
  category: "Fun",
  description: "Insults user(s) mentioned (or yourself if no users are mentioned)",
  usage: "\n  insult <@user>\n\n  options:\n 1.-add <insult>\n 2.-list\n 3.-empty (admin only)"
};
