const Discord = require("discord.js");
const answers = [
  "It is certain",
  "It is decidedly so",
  "Without a doubt",
  "Yes definitely",
  "You may rely on it",
  "As I see it, yes",
  "Most likely",
  "Outlook good",
  "Yes",
  "Signs point to yes",
  "Reply hazy try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",
  "Don't count on it",
  "My reply is no",
  "My sources say no",
  "Outlook not so good",
  "Very doubtful"
  ];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

exports.run = (client, message, args, level) => {
  let question = args.join(" ");
  let answer = answers[getRandomInt(0, answers.length)];
  
  const embed = new Discord.RichEmbed()
    .setDescription(`${message.author} asked: **${question}**\n\n**${answer}**`)
    .setColor([114, 137, 218]);
  message.channel.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "8ball",
  category: "Fun",
  description: "Ask the magic 8-ball a question.",
  usage: "\n  8ball"
};
