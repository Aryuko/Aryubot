const fs = require("fs-extra-promise");
const path = require("path");

const absoluteConfigFilePath = path.join(__dirname, "..", "config", "Config.json");
const defaultConfigFile = require("../config/Config.Default.json");

module.exports =
class Config
{
	constructor ()
	{
		var handler = {
			get: function(target, name)
			{
				if(name in target)					// Top level call, like functions or the actual arrays of config
				{
					return target[name];
				} else								// Not found on the top level, you're probably looking for one of the config props
				{									// Let's have a look in config
					let config = target.config;
					if (name in config)				// Cool! We found it :D
					{
						return config[name]
					} else							// Hmm, could be in defaultConfig
					{
						let defaultConfig = target.defaultConfig;
						if (name in defaultConfig)	// Ah, there it was! :D
						{
							return defaultConfig[name];
						}
						else 						// T_T
						{
							console.log("Tried reaching undefined property '" + name + "'");
							return undefined;
						}
					}


					/* if (!(name in config))
					{
						console.log("Getting non-existant property '" + name + "'");
						return undefined;
					} else if ((name in config) && typeof config[name] === 'object')  
					{
						console.log("Getting object property '" + name + "'");
						return new Proxy(config[name], handler);
					} else 
					{
						console.log("Getting existant property '" + name + "'");
						return config[name];
					} */
				}
			},
			set: function(target, name, value)
			{
				if (name in target)	// Top level call, like functions or the actual arrays
				{
					target[name] = value;

				} else				// Not found on the top level, you probably want to set a config prop
				{
					target.config[name] = value;
					target.save();
				}
				return true;
			}
		}

		// Todo: Todo: Build custom config (from file or create if not found), include defaults in Config.Defaults // 
		this.defaultConfig = defaultConfigFile;
		this.config = {};
		this.load();
		return new Proxy(this, handler);
	}
	
	load () 
	{
		return new Promise ((resolve, reject) => 
		{
			try
			{
				var configFile = require(absoluteConfigFilePath);
				this.config = configFile;
			} catch (error)	// no Config.json file found, create an empty one
			{
				fs.writeFileAsync(absoluteConfigFilePath, JSON.stringify({})).then( (data) =>
				{
					console.log(data);
					var configFile = require(absoluteConfigFilePath);
					this.config = configFile;
				});
			}
			resolve();
		})
	}

	save () 
	{
		return new Promise ((resolve, reject) => 
		{
			fs.writeFile(absoluteConfigFilePath, JSON.stringify(this.config), (err) => { if (err) { console.log(err); } });
			resolve();
		})
	}

	getProperty (prop)
	{
		if (this.config.hasOwnProperty(prop)) 
		{
			
		} else if (this.defaultConfig.hasOwnProperty(prop))
		{
			
		} else
		{
			return null;
		}
	}
}