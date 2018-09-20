const Discord = require("discord.js");
const Colours =
{
	purple : "#ab6cfc",
	green : "#1db954",
	red : "#e01818",
	yellow : "#f2ee18"
}

const Config = 
{
	commandPrefix: '!',
	replyTimeout : 120
}

module.exports = 
{
	handleMessage : (message) =>
	{
		if (!message.author.bot && message.content.length > 1)
		{
			var input = parseInput(message.content);
			if(input)
			{
				switch (input.command)
				{
					case 'spoiler':
						handleSpoiler(message);
						break;
					
					// Add a case for each new command //

					default:
						break;
				}
			}
		}
	},
	handleReaction : (reaction, user, clientId) =>
	{
		if (user.id != clientId && reaction.me && reaction.emoji == "🙈")
		{
			let spoiler = rot13(reaction.message.embeds[0].description);
			let originalAuthor = reaction.message.embeds[0].author;
			
			let embed = new Discord.RichEmbed()
			.setColor(Colours.green)
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
	if (result) {
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
	} );
}

function handleSpoiler (message)
{
	let idUrl = "https://" + message.author.id + ".se/";
	let spoilerMessageEmbed = new Discord.RichEmbed()
	.setColor(Colours.yellow)
	.setAuthor(message.author.username, message.author.avatarURL, idUrl)
	.setDescription("...")
	.setFooter("Processing spoiler, waiting for a DM from the author...");

	message.channel.send(spoilerMessageEmbed)
				.then((spoilerMessage) =>
				{
					let botInstructionEmbed = new Discord.RichEmbed()
					.setColor(Colours.yellow)
					.addField("Spoiler?", "Reply to me with your spoiler in clear text and I'll encode, format, and post it after your messsage in the original channel.")
					.setFooter("You have " + Config.replyTimeout + " seconds to reply before I abort.");

					message.author.send(botInstructionEmbed)
					.then((botInstructionMessage) =>
					{
						message.author.dmChannel.awaitMessages((m) => { return m.content.length > 0; }, { max: 1, time: Config.replyTimeout * 1000, errors: ['time'] })
						.then((collected) =>
						{
							let botConfirmationEmbed = new Discord.RichEmbed()
							.setColor(Colours.green)
							.addField("Success! 🎉", "Message has been posted to #" + message.channel.name);
							
							botInstructionMessage.edit(botConfirmationEmbed);
							
							let spoilerMessageSuccessEmbed = new Discord.RichEmbed()
							.setColor(Colours.green)
							.setAuthor(message.author.username, message.author.avatarURL, idUrl)
							.setDescription(rot13(collected.first().content))
							.setFooter("React using a 🙈 to recieve a translation of the spoiler.");
							
							spoilerMessage.edit(spoilerMessageSuccessEmbed)
							.then(spoilerMessage.react("🙈"));
							})
							.catch((error) =>
							{
								let botAbortEmbed = new Discord.RichEmbed()
							.setColor(Colours.red)
							.addField("Aborted 😭", "No response recieved in the given time frame, please repeat the process whenever you have your message ready.")
							.setFooter("Remember, you only have " + Config.replyTimeout + " seconds to reply before I abort.");

							botInstructionMessage.edit(botAbortEmbed);
						});
					})
					.catch(console.error);
				})
				.catch(console.error);
}