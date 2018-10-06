const ConfigFiles = {
	"Default" : require("../config/Config.Default.json")
}

module.exports =
class Config
{
	constructor ()
	{
		// Todo: Todo: Build custom config (from file or create if not found), include defaults in Config.Defaults // 
		this.test1 = 1;
		this['test2'] = 2;
	}
	getProperty (prop)
	{
		if (Config.hasOwnProperty(prop)) 
		{
			
		} else if (Config.Default.hasOwnProperty(prop))
		{
			
		} else
		{
			
		}
	}
}