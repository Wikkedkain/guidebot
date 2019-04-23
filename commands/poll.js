const Discord = require("discord.js");
const responses = [
"\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"
  ];

async function addReactions(message, count) {
  for(var i=0; i<count; i++) {
    await message.react(responses[i]);
  }
}

exports.run = (client, message, args, level) => {
  let parts = args.filter((a) => a.indexOf("<@") < 0).join(" ").split("|").filter((x) => x.trim() != "");
  let question = parts[0];
  let answers=[];
  if(parts.length > (responses.length+1)) return message.reply("Maximum of 10 answers allowed.");
  
  for(var i=1; i<parts.length; i++) {
    answers.push(`${responses[i-1]} ${parts[i]}`);
  }
  if(answers.length == 0) {
    answers.push(":zero: Yes");
    answers.push(":one: No");
  }
  
  const embed = new Discord.RichEmbed()
    .setDescription(`${message.author} asked: **${question}**\n\n**${answers.join("\n")}**`)
    .setColor([114, 137, 218]);
  message.channel.send({embed}).then((message) => {
    addReactions(message, answers.length);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "poll",
  category: "Miscellaneous",
  description: "Start a simple multiple choice poll.",
  usage: "Multiple Choice:\n  poll Question|Answer 1|Answer 2|Answer 3|Answer 4\n\nYes-No:\n  poll \"Question\""
};
