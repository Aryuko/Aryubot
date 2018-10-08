const Command = require("../Command.js");

module.exports = new Command (
	"help",
	() => 
	{
		return true;
	},
	(message, input, client) => 
	{
		if (input.args)
		{
			let command = client.Commands[input.args[0]];
			
			let responseEmbed = new client.Discord.RichEmbed()
			.setColor(client.Config.colours.green)
			.setTitle(client.Config.commandPrefix + command.name)
			.addField("Description", command.description)
			.addField("Syntax", "``" + command.syntax + "``");
			message.channel.send(responseEmbed);
		} else 
		{
			let responseEmbed = new client.Discord.RichEmbed()
			.setColor(client.Config.colours.red)
			.setTitle("Error")
			.setDescription("Invalid arguments, please follow the following syntax:\n``" + client.Config.commandPrefix + client.Commands['help'].syntax + "``");
			message.channel.send(responseEmbed);
		}
	},
	[],
	"Helps by providing information about a given command.",
	"help <command>"
);