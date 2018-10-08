module.exports = 
class Command 
{
	constructor (name, method, aliases, description, syntax) 
	{
		this.name = name;
		this.method = method;
		this.aliases = aliases;
		this.description = description;
		this.syntax = syntax;
	}
	// Todo: Add "setup" method

	// Todo: Finish this after fixing config
	updateConfig () 
	{
		
	}
}