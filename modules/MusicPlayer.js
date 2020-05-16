const ytdl = require('ytdl-core-discord');

// todo:
// song info, communication to user when using the new commands
// queue related info or commands? (peek, clear, etc..)
// seek command
// may want to update discord to stable v12?
// proceed to web portion?
// or work on playlist feature and give ability to load songs from playlist?

class MusicPlayer {
  constructor(guild, logger) {
    this.guild = guild;
    this.logger = logger;
    this.queue = [];
    this.stream = null;
  }
  
  isPlaying() {
    return this.stream != null && !this.stream.destroyed;
  }
  
  isVoiceConnected() {
    return this.guild.voiceConnection && this.guild.voiceConnection.channel;
  }
  
  join(voiceChannelId) {
    if(!this.guild.channels.has(voiceChannelId)) return; // safety check
    let voiceChannel = this.guild.channels.get(voiceChannelId);
    if (!voiceChannel || voiceChannel.type !== 'voice') return; // safety check
    voiceChannel.join();
  }
  leave() {
    if(this.guild.voiceConnection) {
      this.guild.voiceConnection.channel.leave();
    }
  }
  async playSong(url) {
  	this.stream = this.guild.voiceConnection.playOpusStream(await ytdl(url));
  	this.stream.on("end", () => {
  	  this.logger.debug("Song ended");
  	});
    this.stream.on("error", (err) => {
        if(this.logger) this.logger.error(err);
    });
  }
  play() {
    if(!this.guild.voiceConnection) {
      throw new Error("Failed to play music. Must be in a voice channel first.");
    }
    if(this.isPlaying()) { // resume
      this.stream.resume();
    } else { // new song
      let song = this.queue.shift();
      if(!song) {
        throw new Error("Failed to play music. No songs in the queue.");
      }
      this.playSong(song.url);
    }
  }
  pause() {
    if(this.isPlaying()) {
      this.stream.pause();
    }
  }
  stop() {
    this.guild.voiceConnection.disconnect();
  }
  addSong(url) {
    this.queue.push(url);
  }
  addSongs(urls) {
    for(let i=0;i<urls.length;i++) {
      this.addSong(urls[i]);
    }
  }
  skipSong() {
    if(this.isPlaying()) {
      this.stream.end();
      this.play();
    }
  }
  emptyQueue() {
    this.queue = [];
  }
  getQueue() {
    return this.queue;
  }
}

module.exports = {
  getInstance: (function() {
    let instances = {};
    
    return function(guild, logger) {
      if (instances[guild.id] == undefined) {
        instances[guild.id] = new MusicPlayer(guild, logger);
      }
      return instances[guild.id];
    };
  }())
};