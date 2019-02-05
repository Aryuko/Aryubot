const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
    "variables",
	// init: // 
	(client) => 
	{
		return true;
	},
	// method: // 
    (message, input, client) => 
    {
		let responseEmbed = new client.Discord.RichEmbed()
		.setColor(client.Config.colours.personal);
		
        for (variableGroup in client.Variables)
        {
			let variables = []
			for (variable in client.Variables[variableGroup])
			{
				variables.push("• " + variable + ": " + client.Variables[variableGroup][variable]);
			}
			if (variables.size == 0) { variables = ["*(none)*"]; }
			responseEmbed.addField(variableGroup, variables.join("\n"));
        }
        message.channel.send(responseEmbed);
    },
	// aliases: //
    [],
	// description: // 
    "Returns all current set variables",
	// syntax: // 
    "variables"
);