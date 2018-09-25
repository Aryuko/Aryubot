const Command 	= require("../Command.js");

module.exports = new Command (
	"commandlist",
	(message, input, client) => 
	{
		let commandList =  "";
		for (command in client.Commands) {
			commandList += client.Config.commandPrefix + command + "\n";
		}

		let responseEmbed = new client.Discord.RichEmbed()
		.setColor(client.Config.colours.green)
		.addField("Commands", commandList);

		message.channel.send(responseEmbed);
	},
	[],
	"Lists all available commands.",
	"commandlist",
	[]
);