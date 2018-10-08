module.exports = 
{
	handleMessage : (message, client) =>
	{
		if (!message.author.bot && message.content.length > 1 && message.guild) // TODO: Add support for DM commands //
		{
			var input = parseInput(message.content, client);
			if(input && client.Commands.hasOwnProperty(input.command) && client.Commands[input.command].enabled && permitted(message.member, client.Commands[input.command], client))
			{
				client.Commands[input.command].method(message, input, client);
			}
		}
	},
	handleReaction : (reaction, user, client) =>
	{
		if (user.id != client.user.id && reaction.me && reaction.emoji == client.Config.spoilerEmoji)
		{
			let spoiler = rot13(reaction.message.embeds[0].description);
			let originalAuthor = reaction.message.embeds[0].author;
			
			let embed = new client.Discord.RichEmbed()
			.setColor(client.Config.colours.green)
			.setAuthor(originalAuthor.name, originalAuthor.iconURL)
			.setDescription(spoiler)
			.setFooter("Originally posted in #" + reaction.message.channel.name);

			user.send(embed);
		}
	}
}

/**
 * Parses input for commands and arguments and returns them.
 * @param {string} string
 * @param {Client} client
 * @return {array} An array containing a string 'command' and an array of arguments 'args'
 */
function parseInput (string, client)
{
	let regex = new RegExp("\\" + client.Config.commandPrefix + '(\\w+)(.*)', 'g');	// Capture one single word following the specified prefix
	let result = regex.exec(string);
	if (result) 
	{
		let args = result[2].trim().match(/(?:[^\s"']+|["'][^"']*["'])+/g);		// https://stackoverflow.com/a/16261693/5621850
		for (index in args) { args[index] = args[index].replace(/["']/g, ''); }
		return {
			'command': command = result[1].toLowerCase(),
			'args': args = args
		}
	}
	else { return false; } 
}

/**
 * @param {Member}	member 
 * @param {Command}	command 
 * @param {Client}	client 
 * @return			True if user has permission to use the given command, False if not
 */
function permitted (member, command, client)
{
	if (!client.Config.commands[command.name].permissionGroup) { return true; }		// Permission group isn't set //
	else																		// Permission group is set //
	{
		let permissionGroup = client.Config.permissionGroups[client.Commands[command.name].permissionGroup];
		if (permissionGroup.users.includes(member.id)) { return true; }			// User is included in user list //
		else
		{
			for (role of permissionGroup.roles)
			{
				if (member.roles.keyArray().includes(role))	{ return true; }	// Any of the user's roles are in the role list // 
			}
		}
	}
	return false;
}

function rot13 (string) 
{
	return string.replace(/[A-Za-z]/g, function (c)
	{
	  return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".charAt(
			 "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm".indexOf(c) 
			 );
	});
}