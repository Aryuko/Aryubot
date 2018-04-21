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
	handleReaction : (r, u, cud) =>
	{
		if (u.id != cud && r.me && r.emoji == "🙈")
		{
			let spoiler = rot13(findSpoiler(r.message.content)[1]);
			let regex = /!spoiler\((.*)\)/g;
			let newMessage = r.message.content.replace(regex, "*" + spoiler + "*");
			
			let embed = new Discord.RichEmbed()
			.setColor(Colours.green)
			.setAuthor(r.message.author.username, r.message.author.avatarURL)
			.addField("🙈", newMessage)
			.setFooter("Originally posted in #" + r.message.channel.name);

			u.send(embed).then(() => console.log("Spoiler sent! o7")).catch(console.error);
		}
	}
}

function findSpoiler (s)
{
	let regex = /!spoiler\((.*)\)/g;
	let result = regex.exec(s);

	return result;
}

function rot13 (s) 
{
	return s.replace(/[A-Za-z]/g, function (c)
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