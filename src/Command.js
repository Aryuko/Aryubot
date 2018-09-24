module.exports = 
class Command 
{
	constructor (commandName, method, aliases, description, syntax, config) 
	{
		this.commandName = commandName;
		this.method = method;
		this.aliases = aliases;
		this.description = description;
		this.syntax = syntax;
		this.config = config;
	}
}