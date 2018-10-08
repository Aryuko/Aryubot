const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
	"examplecommand",
	// init: // 
	(client) => 
	{
		return true;
	},
	// method: // 
	(message, input, client) => 
	{
		return true 
	},
	// aliases: //
	[],
	// description: // 
	"An example command that shows how to build commands.",
	// syntax: // 
	"examplecommand"
);