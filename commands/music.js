const MusicPlayer = require("../modules/MusicPlayer");
const DbMap = require("../modules/dbmap");
let playlistMap;


function getSongsFromPlaylist(id, playlistName) {
  let playlists = playlistMap.get(id);
  let playlist = playlists.find(p => p.name == playlistName);
  
  if(playlist == undefined)
    return [];
  else
    return playlist.songs;
}

exports.run = (client, message, [action, ...args]) => {
  let musicPlayer = MusicPlayer.getInstance(message.guild, client.logger);
  
  switch(action) {
    case "play":
    case "resume":
      if(!musicPlayer.isVoiceConnected()) { // join voice if not already
        musicPlayer.join(message.member.voiceChannel.id);
      }
      musicPlayer.play();
      return message.reply("Playing music.");
    case "pause":
      musicPlayer.pause();
      return message.reply("Pausing music.");
    case "stop":
      return musicPlayer.stop();
    case "join":
      return musicPlayer.join(message.member.voiceChannel.id);
    case "leave":
      return musicPlayer.leave();
    case "add":
      return musicPlayer.addSong(args[0]);
    case "skip":
      return musicPlayer.skipSong();
    case "empty":
      return musicPlayer.emptyQueue();
    case "queue":
    case "view":
      let queue = musicPlayer.getQueue();
      let printedQueue = queue.map((s,i) => `${i+1}. ${s.title} <${s.url}>`);
      let reply = `Songs:\n\n${printedQueue.join('\n')}`;
      return message.reply(reply);
    case "load":
      let songs = getSongsFromPlaylist(message.member.id, args[0]);
      
      musicPlayer.addSongs(songs);
      return;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["m"],
  permLevel: "Bot Support"
};

exports.init = async () => {
  playlistMap = new DbMap("playlists");
}

exports.help = {
  name: "music",
  category: "Music",
  description: "Music player command.",
  usage: 
    `
    music play            : Start playing music from the queue.
    music pause           : Pause the music.
    music resume          : Resume the music.
    music stop            : Stop playing and leave the voice channel.
    music join            : Join the user's voice channel.
    music leave           : Leave the voice channel.
    music add <url>       : Add a song to the queue.
    music skip            : Skip the current song.
    music empty           : Empty the current queue.
    music view            : View the current queue.
    music load <playlist> : Load songs from a playlist into the queue.
    `
};
