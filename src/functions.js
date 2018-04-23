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
	replyTimeout : 120
}

module.exports = 
{
	handleMessage : (message) =>
	{
		if (!message.author.bot && message.content.length > 1)
		{
			// let words = message.content.split(" ");
			if(findSpoiler(message.content))
			{
				handleSpoiler(message);
			}
		}
	},
	handleReaction : (reaction, user, clientId) =>
	{
		if (user.id != clientId && reaction.me && reaction.emoji == "🙈")
		{
			let spoiler = rot13(reaction.message.embeds[0].fields[0].value);
			let originalAuthor = reaction.message.embeds[0].author;
			
			let embed = new Discord.RichEmbed()
			.setColor(Colours.green)
			.setAuthor(originalAuthor.name, originalAuthor.iconURL)
			.addField("Spoiler 🙈", spoiler)
			.setFooter("Originally posted in #" + reaction.message.channel.name);

			user.send(embed);
		}
	}
}

function findSpoiler (string)
{
	let regex = /!spoiler/g;
	let result = regex.exec(string);
	return result;
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
	let spoilerMessageEmbed = new Discord.RichEmbed()
	.setColor(Colours.yellow)
	.setAuthor(message.author.username, message.author.avatarURL)
	.addField("Spoiler 🙈", "...")
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
						message.author.dmChannel.awaitMessages(() => { return true; }, { max: 1, time: Config.replyTimeout * 1000, errors: ['time'] })
						.then((collected) =>
						{
							let botConfirmationEmbed = new Discord.RichEmbed()
							.setColor(Colours.green)
							.addField("Success! 🎉", "Message has been posted to #" + message.channel.name);

							botInstructionMessage.edit(botConfirmationEmbed);
							
							let spoilerMessageSuccessEmbed = new Discord.RichEmbed()
							.setColor(Colours.green)
							.setAuthor(message.author.username, message.author.avatarURL)
							.addField("Spoiler 🙈", rot13(collected.first().content))
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