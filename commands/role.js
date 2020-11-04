const availableRoles = ["nsfw", "botspam"];

exports.run = (client, message, args, level) => {
  let keywords = ["join", "leave"];
  for(var i in keywords) {
    if(args[0] === keywords[i]) {
      args = args.slice(1);
      message.flags.push(keywords[i]);
      break;
    }
  }
  let role;
  
  switch(message.flags[0]) {
    case "join":
      role = message.guild.roles.find("name", args[0]);
      if(role != null && availableRoles.indexOf(role.name) > -1) {
        message.member.addRole(role, `User requested to join role ${role}.`).then(() => {
          message.reply(`You joined role '${role.name}'`);  
        }).catch(err => client.logger.error(err));
      }
      else {
        message.reply(`Failed to join role '${args[0]}'.`);
      }
      break;
    case "leave":
      role = message.guild.roles.find("name", args[0]);
      
      if(role != null && availableRoles.indexOf(role.name) > -1) {
        message.member.removeRole(role, `User requested to leave role ${role}.`).then(() => {
          message.reply(`You left role '${role.name}'`);  
        }).catch(err => client.logger.error(err));
      }
      else {
        message.reply(`Failed to leave role '${args[0]}'.`);
      }
      break;
    default:
      return message.reply(`You must indicate a flag to use this command. See ${client.config.prefix}help for more information.`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["roles"],
  permLevel: "User"
};

exports.help = {
  name: "role",
  category: "Moderation",
  description: "Users can join/leave available roles.",
  tags: ["join", "leave"],
  usage: "role <options> <rolename>\n\nOptions:\n 1.-join <rolename>\n 2.-leave <rolename>\n\nAvailable roles: nsfw"
};
