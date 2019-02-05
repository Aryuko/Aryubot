const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
	"commandlist",
	// init: // 
	(client) => 
	{
		return true;
	},
	// method: // 
	(message, input, client) => 
	{
		let commands = [];
		let title = ""; 
		// TODO: Move title and bool switch out of the for loop! It requires c to be defined atm, something will have to change //
		for (command in client.Commands) {
			let c = client.Commands[command];

			let bool = true;
			if (input.args)
			{
				switch (input.args[0])
				{
					case "all":
						bool = c.enabled;
						title = "All commands";
						break;
					default:
						bool = c.enabled && (c.permissionGroup == false || c.permissionGroup == input.args[0]);
						title = "Commands for group '" + input.args[0] + "'";
						break;
				}
			} else 
			{
				bool = c.enabled && c.permissionGroup == false;
				title = "Public commands";
			}

			if (bool)
			{
				commands.push("• " + client.Config.commandPrefix + c.name);
			}
		}

		let responseEmbed = new client.Discord.RichEmbed()
		.setColor(client.Config.colours.success)
		.setTitle(title)
		.setDescription(commands.join("\n"))
		.setFooter("Use " + client.Config.commandPrefix + "help <command> to find out more about the commands");
		message.channel.send(responseEmbed);
	},
	// aliases: //
	["commands"],
	// description: // 
	"Lists all available commands.",
	// syntax: // 
	"commandlist [?all/<permissionGroup>]"
);