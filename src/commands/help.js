const Command = require("../Command.js");

module.exports = new Command (
	"help",
	(message, input, client) => 
	{
		let command = client.Commands[input.args[0]];
		
		let responseEmbed = new client.Discord.RichEmbed()
		.setColor(client.Config.colours.green)
		.setTitle(client.Config.commandPrefix + command.commandName)
		.addField("Description", command.description)
		.addField("Syntax", "``" + command.syntax + "``");
		message.channel.send(responseEmbed);
	},
	[],
	"Helps by providing information about a given command.",
	"help <command>",
	[]
);