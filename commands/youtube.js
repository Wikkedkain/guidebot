const yt = require("ytdl-core");

function play(song, message) {
    let dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes: 1});
    let collector = message.channel.createMessageCollector(m => m);
    collector.on("message", m => {
        if(m.content.startsWith(message.settings.prefix + "pause")) {
            message.channel.sendMessage("paused").then(() => {dispatcher.pause();});
        }
        if(m.content.startsWith(message.settings.prefix + "resume")) {
            message.channel.sendMessage("resumed").then(() => {dispatcher.resume();});
        }
        if(m.content.startsWith(message.settings.prefix + "stop")) {
            message.channel.sendMessage("stopped").then(() => {dispatcher.end();});
        }
    });
    dispatcher.on("end", () => {
        collector.stop();
    });
    dispatcher.on("error", (err) => {
        return message.channel.sendMessage("error: " + err).then(() => {
            collector.stop();
        });
    });
}

exports.run = (client, message, args) => {
    console.log(args);
    let url = args[0];
    
    switch(message.flags[0]) {
        case ("join"):
            const voiceChannel = message.member.voiceChannel;
            if(!voiceChannel || voiceChannel.type !== "voice") return message.reply("I couldn't connect to your voice channel.");
            client.logger.debug(`${voiceChannel.name}`);
            voiceChannel.join().catch((err) => console.log(err));
            
            break;
        case ("leave"):
            message.member.voiceChannel.leave();
            break;
        case ("play"):
            yt.getInfo(url, (err, info) => {
               if(err) return message.channel.sendMessage("Invalid YouTube Link: " + err);
               play({url:url, title: info.title, requester: message.author.username}, message);
               message.channel.sendMessage(`Playing **${info.title}** in **${message.member.voiceChannel.name}**`);
            });
            break;
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["yt"],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "youtube",
  category: "Miscellaneous",
  description: "Play youtube audio in the voice channel by URL or Id",
  usage: "youtube <url>\n\nyoutube <id>"
};
