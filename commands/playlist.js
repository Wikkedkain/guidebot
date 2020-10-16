const DbMap = require("../modules/dbmap");
const yt = require("ytdl-core");
let playlistMap;

/**
 * Returns array of playlists for this user
 * [
 *   { name: "My Playlist", songs: [] },
 *   { name: "Another Playlist", songs: [] }
 * ]
 */
function getPlaylists(id) {
  return playlistMap.get(id) || [];
}

/**
 * Saves the playlists
 */
function savePlaylists(id, playlists) {
  playlistMap.set(id, playlists || []);
}

function findPlaylist(id, name) {
  return getPlaylists(id).find(p => p.name === name);
}

function createPlaylist(name) {
  let playlist = {
    name: name,
    songs: []
  };
  
  return playlist;
}

function addPlaylist(id, name) {
  let playlists = getPlaylists(id);
  let playlistAlreadyExists = playlists.some(p => p.name == name);
  if(playlistAlreadyExists) {
    return `Playlist ${name} already exists.`;
  }
  let playlist = createPlaylist(name);
  let newPlaylists = [...playlists, playlist];
  savePlaylists(id, newPlaylists);
  
  return `Created playlist ${name}.`;
}

function deletePlaylist(id, name) {
  let playlists = getPlaylists(id);
  let newPlaylists = playlists.filter(p => p.name !== name);
  savePlaylists(id, newPlaylists);
  return `Deleted playlist ${name}.`;
}

async function loadSongInfo(url) {
  try {
    let info = await yt.getInfo(url);
    return { url: url, title: info.title };
  }
  catch(err) {
    return { url:url, title: 'unknown' };
  }
}

async function editPlaylistAddSong(playlist, url) {
  let song = await loadSongInfo(url);
  let result = {
    name: playlist.name,
    songs: [...playlist.songs, song]
  };
  return result;
}

function editPlaylistRemoveSong(playlist, url) {
  let result = {
    name: playlist.name,
    songs: playlist.songs.filter(s => s.url !== url)
  };
  return result;
}

function savePlaylist(playlists, playlist) {
  let others = playlists.filter(p => p.name !== playlist.name)
  return [...others, playlist];
}

function getSubActionReply(subAction) {
  if(subAction === 'add') return 'Added song to playlist:';
  if(subAction === 'remove') return 'Removed song from playlist:';
}

function editPlaylist(id, name, subAction, url) {
  let playlists = getPlaylists(id);
  let playlist = findPlaylist(id, name);
  
  switch(subAction) {
    case "add":
      let songAlreadyExists = playlist.songs.some(s => s.url == url);
      if(songAlreadyExists) {
        return `Song already exists in ${playlist.name}.`;
      }
      editPlaylistAddSong(playlist, url).then(newPlaylist => {
        let newPlaylists = savePlaylist(playlists, newPlaylist);
        savePlaylists(id, newPlaylists);
      });
      break;
    case "remove":
      let newPlaylist = editPlaylistRemoveSong(playlist, url);
      let newPlaylists = savePlaylist(playlists, newPlaylist);
      savePlaylists(id, newPlaylists);
      break;
  }
  return `${getSubActionReply(subAction)} ${name}`;
}

function validateArguments(action, name, subAction, url) {
  if(action == undefined || action == "") {
    return "You must specify an action to perform. **-pl edit <name> <subAction> <url>**";
  }
  if(action == "list" || action == "empty") return "";
  if(name == undefined || name == "") {
    return `You must specify the playlist name.  **-pl edit <name> <subAction> <url>**`;
  }
  if(action == "edit") {
    if(subAction !== 'add' && subAction !== 'remove') {
      return `You must specify whether to *add* or *remove* the song. **-pl edit ${name} add <url>**`;
    }
    if(url == undefined || url == "") {
      return `You must specify the url of the song to ${subAction}. **-pl edit ${name} ${subAction} <url>**`;
    }
  }
  return "";
}

function cleanOriginalMessage(client, message, url) {
  let escapedUrl = url.escapeUrl();
  
  if(message.editable) {
    message.edit(message.content.replace(url, escapedUrl)).catch(err => client.logger.error(err));
  }
}

exports.run = async (client, message, [action, name, subAction, url]) => {
  let id = message.member.id;
  let reply;
  let validateMessage = validateArguments(action, name, subAction, url);
  if(validateMessage != "") return message.reply(validateMessage);
  
  switch(action) {
    case "create":
      reply = addPlaylist(id, name);
      break;
    case "delete":
      reply = deletePlaylist(id, name);
      break;
    case "edit":
      reply = editPlaylist(id, name, subAction, url);
      cleanOriginalMessage(client, message, url);
      break;
    case "list":
      let playlists = getPlaylists(id);
      let printablePlaylists = playlists.map(p => `${p.name}: ${p.songs.length} songs.`);
      reply = `${printablePlaylists.length} Playlists:\n\n${printablePlaylists.join('\n')}`;
      break;
    case "view":
      let playlist = findPlaylist(id, name);
      if(playlist == undefined) return;
      let printableSongs = playlist.songs.map((s,i) => `${i+1}. ${s.title} <${s.url}>`);
      reply = `**${name}:**\n${printableSongs.join('\n')}`;
      break;
    case "empty":
      savePlaylists(id, []);
      reply = "Deleted all of your playlists.";
      break;
  }
  message.reply(reply);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["pl"],
  permLevel: "User"
};

exports.init = async () => {
  playlistMap = new DbMap("playlists");
};

exports.help = {
  name: "playlist",
  category: "Music",
  description: "Manage your personal music playlists.",
  usage: 
    `
    playlist create <name>             : Create a playlist.
    playlist view <name>               : View songs in the playlist.
    playlist list                      : List all of your playlists.
    playlist delete <name>             : Delete the playlist.
    playlist edit <name> add <url>     : Add a song to the playlist.
    playlist edit <name> remove <url>  : Remove a song from the playlist.
    `
};