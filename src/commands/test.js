const Command = require("../Command.js");

module.exports = new Command (
    "test",
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
    [],
    "A test command used to see if arguments work properly.",
    "test [arg1], [arg2], [arg3].."
);