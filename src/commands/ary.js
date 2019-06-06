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
                            case "love":
                                // list kept here: https://imgur.com/a/GrNmqEd
                                let images = [
                                    "https://i.imgur.com/E6nGQZd.jpg",
                                    "https://i.imgur.com/yvZnywG.jpg",
                                    "https://i.imgur.com/pAA4MyS.jpg",
                                    "https://i.imgur.com/UMnXAZE.jpg",
                                    "https://i.imgur.com/OdiQhcc.jpg",
                                    "https://i.imgur.com/YLYBqmN.jpg",
                                    "https://i.imgur.com/qYvAX4j.jpg",
                                    "https://i.imgur.com/KWRWAMy.jpg",
                                    "https://i.imgur.com/2tYlzUZ.jpg",
                                    "https://i.imgur.com/xAIEI1e.jpg",
                                    "https://i.imgur.com/bVLMIHw.jpg",
                                    "https://i.imgur.com/oVfPr0O.png",
                                    "https://i.imgur.com/mqOH1oB.jpg",
                                    "https://i.imgur.com/O34GqOm.jpg",
                                    "https://i.imgur.com/xl8F55D.jpg",
                                    "https://i.imgur.com/21pxxup.png"
                                ]
                                let i = Math.floor(Math.random() * images.length)
                                message.channel.send('', { files: [ images[i] ] })
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