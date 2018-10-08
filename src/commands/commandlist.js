const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
	"commandlist",
	// init: // 
	() => 
	{
		return true;
	},
	// method: // 
	(message, input, client) => 
	{
		let commandList =  "";
		for (command in client.Commands) {
			commandList += "• " + client.Config.commandPrefix + command + "\n";
		}

		let responseEmbed = new client.Discord.RichEmbed()
		.setColor(client.Config.colours.green)
		.setTitle("Commands")
		.setDescription(commandList)
		.setFooter("Use " + client.Config.commandPrefix + "help <command> to find out more about the commands");
		message.channel.send(responseEmbed);
	},
	// aliases: //
	["commands"],
	// description: // 
	"Lists all available commands.",
	// syntax: // 
	"commandlist"
);