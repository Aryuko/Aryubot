const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
    "test",
	// init: // 
	() => 
	{
		return true;
	},
	// method: // 
    (message, input, client) => 
    {
        let responseEmbed = new client.Discord.RichEmbed()
        .setColor(client.Config.colours.purple)
        .addField("Command", input.command);
        if(input.args) 
        {

            let argsString = "";
            for (arg of input.args)
            {
                argsString += arg + "\n";
            }
            if (argsString.length == 0) { argsString = "*(none)*"; }
            responseEmbed.addField("Arguments", argsString);
        }
        message.channel.send(responseEmbed);
    },
	// aliases: //
    [],
	// description: // 
    "A test command used to see if arguments work properly.",
	// syntax: // 
    "test [arg1], [arg2], [arg3].."
);