let actions = ["Squeezes", "Pets", "Hugs", "Kisses"];
let pets = ["Hamster", "Kitty", "Doggy"];
let petsPlural = ["Hamsters", "Kitties", "Doggies"];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

exports.run = (client, message, args, level) => {
  let users = message.mentions.users;
  
  let action = actions[getRandomInt(0, actions.length)];
  
  let index = getRandomInt(0, pets.length);
  
  let pet = users.size > 1 ? petsPlural[index] : pets[index];
  
  if(users.size < 1) return message.channel.send(`\\*${action} ${message.author}*. Good ${pet}.`).then(() => {
    if(!!message.guild && message.deletable) {
      message.delete().catch(err => client.logger.error(err));
    }
  });
  
  return message.channel.send(`\\*${action} ${users.array().join(', ')}*. Good ${pet}.`).then(() => {
    if(!!message.guild && message.deletable) {
      message.delete().catch(err => client.logger.error(err));
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "pet",
  category: "Fun",
  description: "Pets the user(s) mentioned (or yourself if no users are mentioned)",
  usage: "pet <@user>"
};
