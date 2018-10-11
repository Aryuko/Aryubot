const fs = require("fs-extra-promise");
const path = require("path");

const configFilePath = path.join(__dirname, "..", "config", "Config.json");
const defaultConfigFile = require("../config/Config.Default.json");

module.exports =
class Config
{
	constructor ()
	{
		var handler =
		{
			get: function (target, name)
			{
				console.log("custom get triggered: " + name);
				if (name in target)
				{			// Top level call, like functions or the actual arrays of config
					return target[name];
				} else
				{			// Not found on the top level, you're probably looking for one of the config props
					let config = target.config;
					if (name in config)	
					{		// Cool! We found it :D
						if (typeof config[name] == "object")
						{	// If it's an object, we'll have to fill in missing values from default
							let defaultProp = target.defaultConfig[name];
							let configProp = config[name];
							return target.combineObjects(defaultProp, configProp, target);
						} else
						{	// Not an object, return as normal
							return config[name];
						}
					} else
					{		// Hmm, could be in defaultConfig
						let defaultConfig = target.defaultConfig;
						if (name in defaultConfig)
						{	// Ah, there it was! :D
							return defaultConfig[name];
						}
						else
						{	// Nowhere to be found T_T
							console.log("Tried reaching undefined property '" + name + "'");
							return undefined;
						}
					}
				}
			},
			set: function (target, name, value)
			{
				if (name in target)
				{	// Top level call, like functions or the actual arrays
					target[name] = value;
				} else
				{	// Not found on the top level, you probably want to set a config prop
					target.config[name] = value;
					target.save();
				}
				return true;
			}
		}

		this.defaultConfig = defaultConfigFile;
		this.config = {"colours": {}, "permissionGroups": {}, "commands": {}};
		this.load();
		return new Proxy(this, handler); 
	}
	
	load () 
	{
		return new Promise ((resolve, reject) => 
		{
			try
			{
				var configFile = require(configFilePath);
				this.config = configFile;
			} catch (error)	// no Config.json file found, create an empty one
			{
				fs.writeFileAsync(configFilePath, JSON.stringify(this.config, null, 2)).then( (err) =>
				{
					if (err)
					{
						console.log(err);
						reject(err);
					}
					var configFile = require(configFilePath);
					this.config = configFile;
				});
			}
			resolve();
		})
	}

	save () 
	{
		console.log("save: ", this.config);
		// console.log("Config.json updated");
		return new Promise ((resolve, reject) => 
		{
			fs.writeFileAsync(configFilePath, JSON.stringify(this.config, null, 2)).then( (err) => 
			{
				if (err)
				{
					console.log(err);
					reject(err);
				}
				resolve();
			});
		})
	}

	// Recursively adds all properties of objects in obj2 to obj1
	combineObjects (obj1, obj2, ogTarget)	// Todo: Fix set not saving on Objects created by this.
	{
		// console.log("ogTarget: ");
		// console.log(ogTarget);
		// console.log(this);
		let obj = obj1;
		for (var key in obj2)
		{
			if (typeof obj2[key] == "object") 
			{
				obj[key] = this.combineObjects(obj1[key], obj2[key], ogTarget);
			} else 
			{
				obj[key] = obj2[key];
			}
		}
		return new Proxy(obj, {
			set: function (target, name, value)
			{
				// console.log("setting subobject '" + name + "'");
				// console.log("value before change: " + target[name]);
				target[name] = value;
				// console.log("value after change: " + target[name]);
				// console.log("config after change: " + ogTarget[name]);
				// changing target[name] doesn't seem to change the original config

				// `ogTarget` ignores proxy? ofc it does ._. so does `this`.. and gives undefined for get?
				// console.log("dc.cp: " + ogTarget.defaultConfig.commandPrefix);
				// console.log("c.cp: " + ogTarget.commandPrefix);
				ogTarget.save();
			}
		});
		return obj;
	}
}