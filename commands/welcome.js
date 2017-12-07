

exports.run = (client, message, args, level) => {
    let users = message.mentions.users;
    if(users.size < 1) return message.reply('You must mention someone to welcome them.').catch(console.error);
    
    
    message.channel.send("Welcome to Thiscord " + users.array().join(', ') + "!");
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Moderator"
};

exports.help = {
    name: "welcome",
    category: "Miscellaneous",
    description: "Welcomes user(s) mentioned",
    usage: "welcome @username"
}