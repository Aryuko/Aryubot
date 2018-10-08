const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
	"destroy",
	// init: // 
	() => 
	{
		return true;
	},
	// method: // 
	(message, input, client) => 
	{
		message.channel.send("Good bye :(");
		client.destroy();
	},
	// aliases: //
	[],
	// description: // 
	"Logs out, terminates the connection to Discord, and destroys the client.",
	// syntax: // 
	"destroy"
);