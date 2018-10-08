module.exports = 
class Command 
{
	constructor (name, init, method, aliases, description, syntax) 
	{
		this.name = name;
		this.init = init;
		this.method = method;
		this.aliases = aliases;
		this.description = description;
		this.syntax = syntax;
	}

	// Update this.config from the given config object
	updateConfig (config) 
	{
		return this.config = config.commands[this.name];
	}
}