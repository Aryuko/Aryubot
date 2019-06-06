const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
    "Ary",
	// init: // 
	(client) => 
	{
		return true;
	},
	// method: // 
    (message, input, client) => 
    {
        if (input.args)
        {
            switch (input.args[0])
            {
                case "bakugou":
                    if (input.args[1])
                    {
                        switch (input.args[1])
                        {
                            case "fly":
                                message.channel.send('https://www.youtube.com/watch?v=x2uQI_gigTo')
                            break;
                            case "sing":
                                message.channel.send('https://www.youtube.com/watch?v=s7gNGZ6JOFM')
                            break;
                            case "whenim":
                                message.channel.send('https://www.youtube.com/watch?v=a5H2_emWYyw')
                            break;
                        }
                    } else 
                    {
                        message.channel.send('', {files: ["https://i.imgur.com/ivfjBIC.jpg"]})
                    }
                break;
                case "something else":
                    // Something else
                break;
            }
        } else
        {
            let responseEmbed = new client.Discord.RichEmbed()
            .setColor(client.Config.colours.fail)
            .setTitle("Incorrect input")
            .setDescription("I love you but I can't really give you what you want unless you specify what that is with a parameter")
            message.channel.send(responseEmbed)
        }
    },
	// aliases: //
    [],
	// description: // 
    "Ary's special command.",
	// syntax: // 
    "ary [arg1]"
);