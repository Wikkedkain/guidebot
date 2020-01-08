const rollDice = ((sides) => Math.floor(Math.random() * sides) + 1);

exports.run = (client, message, args, level) => {
    client.logger.debug(message, args);
    const x = args.length > 1 ? args[0] : 1; // if 2 arguments, first one is number of dice
    const n = args.length > 1 ? args[1] : args[0]; // if 2 arguments, second one is number of dice; otherwise first argument
    
    if (isNaN(x) || isNaN(n)) {
        return message.reply("You must specify a number to roll a dice.").catch(err => client.logger.error(err));
    }
    
    const rolls = [];
    for(let i = 0; i < x; i++) {
        rolls.push(rollDice(n));
    }
    
    if(rolls.length === 1) {
        message.reply(`You rolled a ${rolls[0]}!`).catch(err => client.logger.error(err));
    } else {
        let rollText = rolls.sort((a,b) => b-a).map((r,i) => `\n${r}`);
        let sum = rolls.reduce((a,b) => a+b);
        message.reply(`You rolled:\n${rollText.join('')}\nSum: ${sum}`).catch(err => client.logger.error(err));
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["roll"],
    permLevel: "User"
};

exports.help = {
    name: "dice",
    category: "Miscellaneous",
    description: "Rolls a dice of n sides. If 2 given two numbers, the first becomes the number of dice to roll and the second is the number of sides.",
    usage: "dice <sides>\n\ndice <quantity> <sides>"
};
