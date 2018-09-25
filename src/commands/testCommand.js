const Discord 	= require("discord.js");
const Config 	= require("../../Config.json");
const Command 	= require("../Command.js");

module.exports = new Command (
    "test",
    (message, input) => 
    {
        let argsString = "";
        for (arg of input.args)
        {
            argsString += arg + " ";
        }
        if (argsString.length == 0) { argsString = "*(none)*"; }
        let responseEmbed = new Discord.RichEmbed()
        .setColor(Config.colours.purple)
        .addField("Command", input.command)
        .addField("Arguments", argsString);
        message.channel.send(responseEmbed);
    },
    [],
    "A test command used to see if arguments work properly.",
    "test [arg1], [arg2], [arg3]..",
    []
);