const DbMap = require("../modules/dbmap");
const yt = require("ytdl-core");
const internalMap = new DbMap("playlists");

/**
 * Returns array of playlists for this user
 * [
 *   { name: "My Playlist", songs: [] },
 *   { name: "Another Playlist", songs: [] }
 * ]
 */
function loadPlaylists(id) {
  return internalMap.get(id) || [];
}

/**
 * Saves the playlists
 */
function savePlaylists(id, playlists) {
  internalMap.set(id, playlists || []);
}

function newPlaylist(name) {
  return {
    name: name,
    songs: []
  };
}

class PlaylistManager {
  constructor(id) {
    this.id = id;
    internalMap.ready(() => {
      // race condition if we try to interact with the map before this fires?
      this.playlists = loadPlaylists(id)
    });
  }
  
  getPlaylists() {
    return this.playlists;
  }
  findPlaylist(name) {
    return this.playlists.filter(p => p.name == name);
  }
  addPlaylist(name) {
    // modify playlists
    // save to db map
  }
  deletePlaylist(name) {
    // modify playlists
    // save to db map
  }
  addSongToPlaylist(name, url) {
    // modify playlists
    // save to db map
  }
  removeSongFromPlaylist(name, url) {
    // modify playlists
    // save to db map
  }
  deleteAllPlaylists() {
    // set playlists to empty
    // save to db map
  }
  printPlaylists() {
    
  }
  printPlaylist(name) {
    
  }
}

module.exports = {
  getInstance: (function() {
    let instances = {};
    
    return function(id) {
      if(instances[id] == undefined) {
        instances[id] = new PlaylistManager(id);
      }
      return instances[id];
    }
  }())
};