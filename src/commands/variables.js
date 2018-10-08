const Command = require("../Command.js");

module.exports = new Command (
    "variables",
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
    [],
    "Returns all current set variables",
    "variables"
);