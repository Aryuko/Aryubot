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
		this.config = {};

		var handler = 
		{
			get: function (target, name)
			{
				if (name in target)
				{		// Accurate top level call
					return target[name];
				} else if (target.config)
				{		// Check in config
					if (name in target.config)
					{	// Yep, return that
						return target.config[name];
					} else
					{	// Not found
						return undefined;
					}
				} else 
				{	// Not found, and no config to look in
					return undefined;
				}
			},
			set: function (target, name, value)
			{
				if (name in target)
				{		// Accurate top level call
					target[name] = value;
				} else
				{		// If not, put it in config
					target.config[name] = value;
				}
				return true;
			},
		}
		
		return new Proxy(this, handler);
	}

	// Update this.config from the given config object
	updateConfig (config) 
	{
		return this.config = config.commands[this.name];
	}
}