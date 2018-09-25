const Discord 	= require("discord.js");
const Config 	= require("../Config.json");
const Command 	= require("./Command.js");

module.exports = 
{
	handleMessage : (message, client) =>
	{
		if (!message.author.bot && message.content.length > 1)
		{
			var input = parseInput(message.content);
			if(input)
			{
				switch (input.command)
				{
					case 'spoiler':
						spoilerCommand(message);
						break;
					
					case 'info':
						infoCommand(message, client);
						break;

					case 'test':
						testCommand(message, input);
						break;

					// Add a case for each new command //

					default:
						break;
				}
			}
		}
	},
	handleReaction : (reaction, user, client) =>
	{
		if (user.id != client.user.id && reaction.me && reaction.emoji == Config.spoilerEmoji)
		{
			let spoiler = rot13(reaction.message.embeds[0].description);
			let originalAuthor = reaction.message.embeds[0].author;
			
			let embed = new Discord.RichEmbed()
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
	let regex = new RegExp(Config.commandPrefix + '(\\w+)(.*)', 'g');	// Capture one single word following the specified prefix
	let result = regex.exec(string);
	if (result) 
	{
		return {
			'args': args = result[0].slice(Config.commandPrefix.length).trim().split(/ +/g),
			'command': command = args.shift().toLowerCase()
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

function spoilerCommand (message)
{
	let idUrl = "https://" + message.author.id + ".se/";
	let spoilerMessageEmbed = new Discord.RichEmbed()
	.setColor(Config.colours.yellow)
	.setAuthor(message.author.username, message.author.avatarURL, idUrl)
	.setDescription("...")
	.setFooter("Processing spoiler, waiting for a DM from the author...");

	message.channel.send(spoilerMessageEmbed)
	.then((spoilerMessage) =>
	{
		let botInstructionEmbed = new Discord.RichEmbed()
		.setColor(Config.colours.yellow)
		.addField("Spoiler?", "Reply to me with your spoiler in clear text and I'll encode, format, and post it after your messsage in the original channel.")
		.setFooter("You have " + Config.replyTimeout + " seconds to reply before I abort.");

		message.author.send(botInstructionEmbed)
		.then((botInstructionMessage) =>
		{
			message.author.dmChannel.awaitMessages((m) => { return m.content.length > 0; }, { max: 1, time: Config.replyTimeout * 1000, errors: ['time'] })
			.then((collected) =>
			{
				let botConfirmationEmbed = new Discord.RichEmbed()
				.setColor(Config.colours.green)
				.addField("Success! 🎉", "Message has been posted to #" + message.channel.name);
				
				botInstructionMessage.edit(botConfirmationEmbed);
				
				let spoilerMessageSuccessEmbed = new Discord.RichEmbed()
				.setColor(Config.colours.green)
				.setAuthor(message.author.username, message.author.avatarURL, idUrl)
				.setDescription(rot13(collected.first().content))
				.setFooter("React using a " + Config.spoilerEmoji + " to recieve a translation of the spoiler.");
				
				spoilerMessage.edit(spoilerMessageSuccessEmbed)
				.then(spoilerMessage.react(Config.spoilerEmoji));
				})
				.catch((error) =>
				{
					let botAbortEmbed = new Discord.RichEmbed()
				.setColor(Config.colours.red)
				.addField("Aborted 😭", "No response recieved in the given time frame, please repeat the process whenever you have your message ready.")
				.setFooter("Remember, you only have " + Config.replyTimeout + " seconds to reply before I abort.");

				botInstructionMessage.edit(botAbortEmbed);
			});
		})
		.catch(console.error);
	})
	.catch(console.error);
}

function infoCommand (message, client)
{
	let responseEmbed = new Discord.RichEmbed()
	.setColor(Config.colours.purple)
	.setAuthor(client.user.username, client.user.avatarURL, "https://github.com/Aryuko/Aryubot")
	.setDescription("Salutations! My name is Penny, and I'm here to help :D")
	.addField("Development", "My development is currently a work in progress. If you want, you can view my code and contribute on [GitHub](https://github.com/Aryuko/Aryubot)!", true)
	.addField("Version", "I'm not really sure which version I am, I haven't been programmed to know yet :(", true)
	.addField("Author", "I'm being developed by someone called Aryu, you can find and contact her at the links below!\n[Reddit](https://www.reddit.com/user/Aryuko) | [Twitter](https://twitter.com/Aryuuko) | [Tumblr](http://pachimaryu.tumblr.com/) | [Steam](https://steamcommunity.com/id/Aryuuu/)")
	.setFooter("Serving " + client.guilds.size + " servers with a combined total of " + client.users.size + " users.\nCurrent uninterrupted uptime: " + timeConversion(client.uptime));
	message.channel.send(responseEmbed);
}

function timeConversion(millisec)
{
	var seconds = Math.floor(millisec / 1000);
	var minutes = Math.floor(millisec / (1000 * 60));
	var hours = Math.floor(millisec / (1000 * 60 * 60));
	var days = Math.floor(millisec / (1000 * 60 * 60 * 24));

	if (seconds < 60) {	return seconds + " Sec"; }
	else if (minutes < 60) { return minutes + " Min"; }
	else if (hours < 24) { return hours + " Hrs"; }
	else { return days + " Days" }
}

function testCommand(message, input)
{
	let argsString = "";
	for (arg of input.args)
	{
		argsString += arg + " ";
	}
	if (argsString.length == 0) { argsString = "*(none)*"; }
	let responseEmbed = new Discord.RichEmbed()
	.setColor(Config.colours.purple)
	.addField("Command", input.command)
	.addField("Arguments", argsString);
	message.channel.send(responseEmbed);
}