
exports.run = (client, message, args, level) => {
    const insults = client.insults.get(message.guild.id);
    
    if(args[0] === "add") { // Add a new insult to the collection
        let insult = args.slice(1).join(" ").replaceAll("\"", "");
        insults.push(insult);
        client.insults.set(message.guild.id, insults); // put back into the map store
        return message.reply(`Adding insult "${insult}" to the collection`);
    }
    else if(args[0] === "empty") { // Empty the collection, Administrators only
        const level = client.permlevel(message);
        let adminLevel = client.levelCache["Administrator"];
        if(level < client.levelCache["Administrator"]) {
            return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${adminLevel} (Administrator)`);
        }
        else {
            client.insults.set(message.guild.id, []); // empty the insults collection
            return message.reply("Insult collection has been emptied.");
        }
    }
    else { // Default: send a random insult!
        let users = message.mentions.users;
        
        if(users.size < 1) return message.reply("You must mention someone to insult them.").catch(console.error);
        if(insults.length < 1) return message.reply("You must add an insult to the collection before using this command.").catch(console.error);
        
        message.channel.send(users.array().join(', ') + " " + insults.random());
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["insults"],
    permLevel: "User"
};

exports.help = {
    name: "insult",
    category: "Miscellaneous",
    description: "Insults user(s) mentioned",
    usage: "\n  insult <@user>\n  insult add <insult>\n  insult empty (admin only)"
};