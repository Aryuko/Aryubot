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
	// Todo: Add "init" method

	// Todo: Finish this after fixing config
	updateConfig (config) 
	{
		this.config = config[this.name];
	}
}