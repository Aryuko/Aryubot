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

	updateConfig () 
	{
		
	}

	get config () // ? //
	{

	}
}