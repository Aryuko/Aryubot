const Discord = require("discord.js");
const Colours =
{
	purple : "#ab6cfc",
	green : "#1db954",
	red : "#e01818"
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
	message.channel.send("Processing spoiler, waiting for a DM from the author...")
				.then((botMessage) =>
				{
					message.author.send("Reply to me with your spoiler and I'll format it for you o7")
					.then((botInstructionMessage) =>
					{
						message.author.dmChannel.awaitMessages(() => { return true; }, { max: 1, time: 60000, errors: ['time'] })
						.then((collected) =>
						{
							// console.log(collected.first().content);
							message.author.send("Response collected o7");
							
							botMessage.edit(rot13(collected.first().content))
							.then(botMessage.react("🙈"));
						})
						.catch((error) =>
						{
							message.author.send("No response collected, aborting.");
						});
					})
					.catch(console.error);
				})
				.catch(console.error);
}