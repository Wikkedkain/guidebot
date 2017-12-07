

exports.run = (client, message, args, level) => {
    let users = message.mentions.users;
    if(users.length < 1) return message.reply('You must mention someone to welcome them.').catch(console.error);
    
    
    await message.channel.send("Welcome " + users.join(', '));
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
};

exports.help = {
    name: "welcome",
    category: "Miscellaneous",
    description: "Welcomes user(s) mentioned",
    usage: "welcome @username"
}