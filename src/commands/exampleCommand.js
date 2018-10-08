const Command = require("../Command.js");

module.exports = new Command (
	"examplecommand",
	() => 
	{
		return true;
	},
	() => 
	{
		return true;
	},
	(message, input, client) => 
	{
		return true 
	},
	[],
	"An example command that shows how to build commands.",
	"examplecommand"
);