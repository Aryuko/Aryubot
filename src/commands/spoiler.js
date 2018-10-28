const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
    "spoiler",
	// init: // 
	(client) => 
	{
		return true;
	},
	// method: // 
    (message, input, client) => 
    {
        let idUrl = "https://" + message.author.id + ".se/";
        let spoilerMessageEmbed = new client.Discord.RichEmbed()
        .setColor(client.Config.colours.progress)
        .setAuthor(message.author.username, message.author.avatarURL, idUrl)
        .setDescription("...")
        .setFooter("Processing spoiler, waiting for a DM from the author...");
    
        message.channel.send(spoilerMessageEmbed)
        .then((spoilerMessage) =>
        {
            let botInstructionEmbed = new client.Discord.RichEmbed()
            .setColor(client.Config.colours.progress)
            .addField("Spoiler?", "Reply to me with your spoiler in clear text and I'll encode, format, and post it after your messsage in the original channel.")
            .setFooter("You have " + client.Config.replyTimeout + " seconds to reply before I abort.");
    
            message.author.send(botInstructionEmbed)
            .then((botInstructionMessage) =>
            {
                message.author.dmChannel.awaitMessages((m) => { return m.content.length > 0; }, { max: 1, time: client.Config.replyTimeout * 1000, errors: ['time'] })
                .then((collected) =>
                {
                    let botConfirmationEmbed = new client.Discord.RichEmbed()
                    .setColor(client.Config.colours.success)
                    .addField("Success! 🎉", "Message has been posted to #" + message.channel.name);
                    
                    botInstructionMessage.edit(botConfirmationEmbed);
                    
                    let spoilerMessageSuccessEmbed = new client.Discord.RichEmbed()
                    .setColor(client.Config.colours.success)
                    .setAuthor(message.author.username, message.author.avatarURL, idUrl)
                    .setDescription(rot13(collected.first().content))
                    .setFooter("React using a " + client.Config.spoilerEmoji + " to recieve a translation of the spoiler.");
                    
                    spoilerMessage.edit(spoilerMessageSuccessEmbed)
                    .then(spoilerMessage.react(client.Config.spoilerEmoji));
                    })
                    .catch((error) =>
                    {
                        let botAbortEmbed = new client.Discord.RichEmbed()
                    .setColor(client.Config.colours.fail)
                    .addField("Aborted 😭", "No response recieved in the given time frame, please repeat the process whenever you have your message ready.")
                    .setFooter("Remember, you only have " + client.Config.replyTimeout + " seconds to reply before I abort.");
    
                    botInstructionMessage.edit(botAbortEmbed);
                });
            })
            .catch(console.error);
        })
        .catch(console.error);
    },
	// aliases: //
    [],
	// description: // 
    "A command that lets you encode spoilers to be able to post them in chat, and let users react to the bot message to recieve a deciphered and readable version",
	// syntax: // 
    "spoiler"
);

function rot13 (string) 
{
	return string.replace(/[A-Za-z]/g, function (c)
	{
	  return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".charAt(
			 "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm".indexOf(c) 
			 );
	});
}