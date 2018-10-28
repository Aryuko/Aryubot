const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
	"help",
	// init: // 
	(client) => 
	{
		return true;
	},
	// method: // 
	(message, input, client) => 
	{
		if (input.args)
		{
			let command = client.Commands[input.args[0]];
			
			let responseEmbed = new client.Discord.RichEmbed()
			.setColor(client.Config.colours.success)
			.setTitle(client.Config.commandPrefix + command.name)
			.addField("Description", command.description)
			.addField("Syntax", "``" + command.syntax + "``");
			message.channel.send(responseEmbed);
		} else 
		{
			let responseEmbed = new client.Discord.RichEmbed()
			.setColor(client.Config.colours.fail)
			.setTitle("Error")
			.setDescription("Invalid arguments, please follow the following syntax:\n``" + client.Config.commandPrefix + client.Commands['help'].syntax + "``");
			message.channel.send(responseEmbed);
		}
	},
	// aliases: //
	[],
	// description: // 
	"Helps by providing information about a given command.",
	// syntax: // 
	"help <command>"
);