const ImgFlipper = require("imgflipper");
const memes = require("../data/memes").memes;
let imgFlipper;

exports.run = (client, message, args) => {
  let keywords = ["list", "check"];
  for(var i in keywords) {
    if (args[0] === keywords[i]) {
      args = args.slice(1);
      message.flags.push(keywords[i]);
      break;
    }
  }
  let name, memeId;
  switch(message.flags[0]) {
    case ("list"):
      const cmd = client.commands.get("memelist");
      return cmd.run(client, message, args);
    case ("check"):
      if(args.length === 0) return;
      name = args[0].trim().toLowerCase();
      memeId = memes[name];
      if(memeId == undefined) message.reply(`Unrecognized meme: ${name}. You can request for this meme to be added.`);
      
      message.reply(`https://imgflip.com/memegenerator/${memeId}`);
      return;
    default:
      //if(args.join(" ").indexOf("|") < 0) return message.reply("Meme command usage: meme <name> <top text>|<bottom text>.");
      let top, bottom;
      if(args.length > 0) name = args.shift().trim().toLowerCase();
      let rest = args.join(" ").split("|");
      if(rest.length > 0) top = rest[0].trim().replaceAll("\"", "");
      if(rest.length > 1) {
        bottom = rest[1].trim().replaceAll("\"", "");
      }
      else {
        bottom = top;
        top = "";
      }
      
      if(top == "" && bottom == "") return message.reply("You must provide text for the meme. Example: **`meme <name> <text>`** or **`meme <name> <top text>|<bottom text>`**");
      
      memeId = memes[name];
      if(memeId == undefined) return message.reply(`Unrecognized meme: ${name}. You can request for this meme to be added.`);
      
      imgFlipper.generateMeme(memeId, top, bottom, (err, url) => {
        if(err) {
          client.logger.error(err);
          return message.reply(`Failed to generate meme for ${name}`);
        }
        message.channel.send(url).then(() => {
          if(!!message.guild && message.deletable) {
            message.delete().catch(err => client.logger.error(err));
          }
        });
      });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["meme", "memebuilder"],
  permLevel: "User"
};

exports.init = async (client) => {
  imgFlipper = new ImgFlipper(client.config.imgFlipUsername, client.config.imgFlipPassword);
};

exports.help = {
  name: "memes",
  category: "Fun",
  description: "Create a meme with the supplied text.",
  usage: "memes <name> <top text>|<bottom text>\n\ntags:\n -list : Get a list of stored memes by name\n -check : Get url to see the image\n"
};