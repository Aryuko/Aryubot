const fs = require("fs-extra-promise");
const path = require("path");

const absoluteConfigFilePath = path.join(__dirname, "..", "config", "Config.json");
const defaultConfigFile = require("../config/Config.Default.json");

module.exports =
class Config
{
	constructor ()
	{
		var validator = {
			get: function(target, name)
			{
				if (!(name in target))
				{
					console.log("Getting non-existant property '" + name + "'");
					return undefined;
				} else if ((name in target) && typeof target[name] === 'object')  
				{
					console.log("Getting object property '" + name + "'");
					return new Proxy(target[name], validator);
				} else 
				{
					console.log("Getting existant property '" + name + "'");
					return target[name];
				}
			},
			set: function(target, name, value)
			{
				if (!(name in target))
				{
					console.log("Setting non-existant property '" + name + "', initial value: " + value);
				}
				target[name] = value;
				return true;
			}
		}

		// Todo: Todo: Build custom config (from file or create if not found), include defaults in Config.Defaults // 
		this.defaultConfig = defaultConfigFile;
		this.config = {};
		this.load().then(() => { return new Proxy(this, validator) });
	}
	
	load () 
	{
		return new Promise (() => 
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
		})
	}

	save () 
	{
		fs.writeFile(absoluteConfigFilePath, JSON.stringify(this.config), (err) => console.log(err))
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