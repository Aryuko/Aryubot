const Config = require("../Config.json");

module.exports = 
{
	handleMessage : (message, client) =>
	{
		if (!message.author.bot && message.content.length > 1)
		{
			var input = parseInput(message.content);
			if(input && client.Commands.hasOwnProperty(input.command))
			{
				client.Commands[input.command].method(message, input, client);
			}
		}
	},
	handleReaction : (reaction, user, client) =>
	{
		if (user.id != client.user.id && reaction.me && reaction.emoji == Config.spoilerEmoji)
		{
			let spoiler = rot13(reaction.message.embeds[0].description);
			let originalAuthor = reaction.message.embeds[0].author;
			
			let embed = new client.Discord.RichEmbed()
			.setColor(Config.colours.green)
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
 * @return {array} An array containing a string 'command' and an array of arguments 'args'
 */
function parseInput (string)
{
	let regex = new RegExp("\\" + Config.commandPrefix + '(\\w+)(.*)', 'g');	// Capture one single word following the specified prefix
	let result = regex.exec(string);
	if (result) 
	{
		let args = result[2].trim().match(/(?:[^\s"']+|["'][^"]*["'])+/g);
		for (index in args) { args[index] = args[index].replace(/["']/g, ''); }
		return {
			'command': command = result[1].toLowerCase(),
			'args': args = args
		}
	}
	else { return false; } 
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