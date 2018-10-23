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
		.setColor(client.Config.colours.purple);
		
        for (variableGroup in client.Variables)
        {
			let varsString = "";
			for (variable in client.Variables[variableGroup])
			{
				varsString += variable + ": " + client.Variables[variableGroup][variable] + "\n";
			}
			if (varsString.length == 0) { varsString = "*(none)*"; }
			responseEmbed.addField(variableGroup, varsString);
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