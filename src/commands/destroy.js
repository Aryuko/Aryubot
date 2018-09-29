const Command = require("../Command.js");

module.exports = new Command (
	"destroy",
	(message, input, client) => 
	{
		message.channel.send("Good bye :(");
		client.destroy();
	},
	[],
	"Logs out, terminates the connection to Discord, and destroys the client.",
	"destroy",
	[]
);