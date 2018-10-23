const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
	"permissiongroup",
	// init: // 
	(client) => 
	{
		return true;
	},
	// method: // 
	(message, input, client) => 
	{
		let Config = client.Config;
		if (input.args)
		{
			let action			= input.args[0];
			let permissiongroup	= (input.args.length >= 2) ? input.args[1] : false;
			let target			= (input.args.length >= 3) ? input.args[2] : false;
			
			switch (action)
			{
				case "create":
					if (permissiongroup)
					{
						// console.log("Config at permissiongroup command call: ", Config.config);
						if (!Config.permissionGroups[permissiongroup])
						{
							Config.permissionGroups[permissiongroup] = 5;
						}
						else {console.log("Already exists")};
					}
					break;
				case "delete":
					// Todo: Fill in
					// Todo: Maybe remove role from commands that used it, reverting them back to default
					break;
				case "addrole":
					// Todo: Fill in
					break;
				case "adduser":
					// Todo: Fill in
					break;
				case "removerole":
					// Todo: Fill in
					break;
				case "removeuser":
					// Todo: Fill in
					break;
				case "display":
					// Todo: Fill in
					break;
			}
		}
	},
	// aliases: //
	[],
	// description: // 
	"A command that lets you create/edit/delete permissiongroups.",
	// syntax: // 
	"permissiongroup create/delete/addrole/adduser/deleterole/deleteuser/display"
);