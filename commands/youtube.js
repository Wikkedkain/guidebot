const yt = require("ytdl-core");
let queue = {};
let connection;

async function play(song, message) {
    let connected = false;
    if(!message.guild.voiceConnection) {
      connected = await join(message).catch((err) => { message.reply("Failed to join voice."); message.client.logger.error(err);});
    }
    if(!connected) return;
    
    message.channel.send(`Playing **${song.title}** in *${message.member.voiceChannel.name}*\n\nYou may **-pause** or **-stop** the music at any time.`);
    let dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes: 5});
    queue[message.guild.id].playing = true;
    let collector = message.channel.createMessageCollector(m => m);
    collector.on("collect", m => {
        if(m.content.startsWith(message.settings.prefix + "pause")) {
            message.channel.send("Paused. You may resume with **-resume**").then(() => {dispatcher.pause();});
        }
        if(m.content.startsWith(message.settings.prefix + "resume") || m.content.startsWith(message.settings.prefix + "play")) {
            message.channel.send("Resuming.").then(() => {dispatcher.resume();});
        }
        if(m.content.startsWith(message.settings.prefix + "stop")) {
            message.channel.send("Stopped.").then(() => {dispatcher.end();});
        }
    });
    function cleanUp() {
        queue[message.guild.id].playing = false;
        collector.stop();
        message.guild.voiceConnection.disconnect();
    }
    dispatcher.on("end", cleanUp);
    dispatcher.on("error", (err) => {
        cleanUp();
        if(message.client.logger) message.client.logger.error(err);
        message.channel.send("error: " + err);
    });
}

function join(message) {
    return new Promise((resolve, reject) => {
        if(message.guild.voiceConnection && message.guild.voiceConnection.channel) {
            return message.reply(`Already connected to ${message.guild.voiceChannel.name}`);
        }
        const voiceChannel = message.member.voiceChannel;
	    if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply("I couldn't connect to your voice channel...");
        message.member.voiceChannel.join().then((conn) => {connection = conn; resolve(true);}).catch((err) => reject(err));
    });
}

exports.run = (client, message, args) => {
    if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false;
    
    let keywords = ["join", "leave", "play"];
    for(var i in keywords) {
        if(args[0] === keywords[i]) {
            args = args.slice(1);
            message.flags.push(keywords[i]);
            break;
        }
    }
    let url = args[0];
    if(message.flags.length == 0) message.flags.push("play"); // default to play
    
    switch(message.flags[0]) {
        case ("join"):
            join(message).catch(err => client.logger.error(err));
            
            break;
        case ("leave"):
            queue[message.guild.id].playing = false;
            if(!message.guild.voiceConnection) {
                return message.reply("Not connected to any voice channel.");
            }
            
            message.guild.voiceConnection.channel.leave();
            break;
        case ("play"):
            if (queue[message.guild.id].playing) return message.channel.send('Already Playing');

            yt.getInfo(url, (err, info) => {
               if(err) return message.channel.send("Invalid YouTube Link: " + err);
               play({url:url, title: info.title, requester: message.author.username}, message);
            });
            break;
    }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["yt"],
  permLevel: "Bot Support"
};

exports.help = {
  name: "youtube",
  category: "Music",
  description: "Play youtube audio in the voice channel by URL or Id",
  usage: "youtube\n\nyoutube play <id>\nyoutube play <url>\nyoutube <url>\n\nFlags:\n-play: Play the url or id specified\n-join: Join user's current voice channel\n-leave: Leave user's current voice channel\n\n*if no flags are specified will default to -play\n"
};
