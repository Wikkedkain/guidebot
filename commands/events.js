const Chrono = require("chrono-node");
const Enmap = require("enmap");
const EnmapPostgres = require("../modules/enmap-postgres");
let eventsMap;

const keywords = ["to", "me", "about", "for", "from"]; // words that can be stripped off the beginning of the message
function cleanContent(messageContent) {
  let results = messageContent.trim().split(" ");
  
  for(let i=0; i<keywords.length; i++) {
    for (let j=results.length-1; j>=0; --j) {
      if(results[j].toLowerCase() === keywords[i]) {
        results.splice(j,1);
      }
    }
  }
  
  return results.join(" ");
}

function formatDateMessage(start, end) {
  
  return "from now until forever";
}

exports.run = (client, message, args) => {
  let events = eventsMap.get(message.guild.id) || [];
  
  let keywords = ["add", "list", "remove"];
  for(var i in keywords) {
    if(args[0] === keywords[i]) {
      args = args.slice(1);
      message.flags.push(keywords[i]);
      break;
    }
  }
  if(message.flags.length === 0) message.flags.push("list");
  let content = args.join(" ");
  
  switch(message.flags[0]) {
    case ("add"):
      
      let parsedDate = Chrono.parse(content)[0];
      let cleanMessage = cleanContent(content.replace(parsedDate.text, ""));
      let start = parsedDate.start.date();
      let end = parsedDate.end != undefined ? parsedDate.end.date() : null;
      let event = {name: cleanMessage, start: start, end: end};
      
      client.logger.debug(event);
      let endMessage = end != undefined ? " and ending on " + end : "";
      events.push(event);
      eventsMap.set(message.guild.id, events);
      return message.reply(`Event parsed: "${cleanMessage}" starting on ${start}${endMessage}`);
    case ("remove"):
      for(var i=0; i<events.length; i++) {
        if(events[i].name === content) {
          events.splice(i, 1);
          break;
        }
      }
      eventsMap.set(message.guild.id, events);
      
      return message.reply(`Removed event "${content}" from list.`);
    case ("list"):
      return message.reply('Events:\n\n' + events.map((n,i) => {return (i + 1) + ". " + n.name + " " + formatDateMessage(n.start, n.end)}).join("\n"));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["event"],
  permLevel: "Bot Admin"
};

exports.init = async () => {
  eventsMap = new Enmap({provider: new EnmapPostgres({name: "events"})});
};

exports.shutdown = async () => {
  if(eventsMap != undefined) await eventsMap.db.close();
};

exports.help = {
  name: "events",
  category: "Utilities",
  description: "Manage event reminders & countdowns.",
  usage: "event\nevents\n\ntags:\n-add\n-list\n-remove\n\n*If no tag is specified, runs -list by default."
};
