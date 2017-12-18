const Enmap = require("enmap");
const EnmapPostgres = require("../modules/enmap-postgres");
let insultsMap;

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
            return message.reply(`Adding insult "${insult}" to the collection`);
        case ("empty") : // Empty the collection
            const level = client.permlevel(message);
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
            return message.reply('Insults:\n\n' + insults.map((n,i) => {return (i + 1) + '. ' + n}).join("\n"));
        default : // Send a random insult!
            let users = message.mentions.users;
            
            if(users.size < 1) return message.reply("You must mention someone to insult them.").catch(console.error);
            if(insults.length < 1) return message.reply("You must add an insult to the collection before using this command.").catch(console.error);
            
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
  await insultsMap.close();
};

exports.help = {
    name: "insult",
    category: "Miscellaneous",
    description: "Insults user(s) mentioned",
    usage: "\n  insult <@user>\n\n  options:\n 1.-add <insult>\n 2.-list\n 2.-empty (admin only)"
};
