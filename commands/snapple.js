const snekfetch = require("snekfetch");
const cheerio = require("cheerio");
const url = "https://www.snapple.com/real-facts";

exports.run = (client, message, args, level) => {
  snekfetch.get(url).then((r) => {
    let $ = cheerio.load(r.body);
    let num = +$("#facts .cap").data("fact");
    let desc = $("#facts .fact-description").first().text().trim();
    
    message.reply(`Real Fact #${num}: ${desc}`);
  }).catch(err => client.logger.error(err));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["snapfact"],
  permLevel: "User"
};

exports.help = {
  name: "snapple",
  category: "Fun",
  description: "Gets a random snapple fact.",
  usage: "\n  snapple"
};
