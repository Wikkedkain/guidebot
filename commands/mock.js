function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function mock(content) {
    let randomStart = getRandomInt(0, 2);
    return content.toLowerCase().split("").map((letter,i) => i%2==randomStart ? letter.toUpperCase() : letter.toLowerCase()).join("");
}

function mockUser(user, message) {
  if(user.lastMessage != null && user.lastMessage.channel.id == message.channel.id && user.lastMessage.content.indexOf(message.settings.prefix) !== 0) {
    message.channel.send(`${user} ${mock(user.lastMessage.content)}`);
  } else {
    message.channel.fetchMessages({
      limit: 20
    }).then(messages => {
      let userMessage = messages.filter(m => m.author.id == user.id && m.content.indexOf(message.settings.prefix) !== 0).first();
      
      if(userMessage != null) message.channel.send(`${user} ${mock(userMessage.content)}`);
    });
  }
}

exports.run = async (client, message, args, level) => {
  let users = message.mentions.users.array();
  
  if(users.length < 1) { // no mentions, just mock the sender
    mockUser(message.author, message);
  } else {
    for(var i=0; i<users.length; i++) {
      mockUser(users[i], message);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "mock",
  category: "Fun",
  description: "TeAcH sOmEoNe A lEsSoN",
  usage: "mock @user"
};
