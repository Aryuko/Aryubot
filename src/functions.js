const Discord = require("discord.js");

module.exports = 
{
	handleMessage : (m) =>
	{
		if (!m.author.bot && m.content.length > 1)
		{
			// let words = m.content.split(" ");
			if(findSpoiler(m.content))
			{
				m.react("🙈");
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
			.setColor("#ab6cfc")
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