module.exports = 
class CommandHandler
{
	constructor (client, commands, config)
	{
		this.client = client;
		this.commands = commands;
		this.config = config;

		this.userLog = {};

		this.aliases = [];
		for (let commandName in this.commands) {
			for (let alias of this.commands[commandName].aliases) {
				this.aliases[alias] = commandName
			}
		}
	}

	handleMessage (message)
	{
		if (!message.author.bot && message.content.length > 1 && message.guild) // TODO: Add support for DM commands //
		{
			let input = this.parseInput(message.content, this.client);
			let command = this.getCommand(input.command);
			if(input && command && command.enabled && this.isPermitted(message.member, command, this.client))
			{
				this.incrementLogCount(message.member.id)

				if (input.args && input.args[0] == 'help')	{ this.getCommand('help').method(message, {'command': 'help', 'args': [input.command]}, this.client) }
				else										{ command.method(message, input, this.client); }
			}
		}
	}

	handleReaction (reaction, user)
	{
		if (!this.isRateLimited(user.id) && user.id != this.client.user.id && reaction.me && reaction.emoji == this.config.spoilerEmoji)
		{
			let spoiler = this.rot13(reaction.message.embeds[0].description);
			let originalAuthor = reaction.message.embeds[0].author;
			
			let embed = new this.client.Discord.RichEmbed()
			.setColor(this.config.colours.success)
			.setAuthor(originalAuthor.name, originalAuthor.iconURL)
			.setDescription(spoiler)
			.setFooter("Originally posted in #" + reaction.message.channel.name);

			this.incrementLogCount(user.id)
			user.send(embed);
		}
	}

	/**
	 * Parses input for commands and arguments and returns them.
	 * @param {string} string
	 * @return {array} An array containing a string 'command' and an array of arguments 'args'
	 */
	parseInput (string)
	{
		let regex = new RegExp("\\" + this.config.commandPrefix + '(\\w+)(.*)', 'g');	// Capture one single word following the specified prefix
		let result = regex.exec(string);
		if (result) 
		{
			let args = result[2].trim().match(/(?:[^\s"']+|["'][^"']*["'])+/g);		// https://stackoverflow.com/a/16261693/5621850
			for (let index in args) { args[index] = args[index].replace(/["']/g, ''); }
			return {
				'command': result[1].toLowerCase(),
				'args': args
			}
		}
		else { return false; } 
	}

	getCommand (commandName)
	{
		if 		(commandName in this.commands) 	{ return this.commands[commandName] }
		else if (commandName in this.aliases) 	{ return this.commands[this.aliases[commandName]] }
	}
	
	/**
	 * @param {Member}	member 
	 * @param {Command}	command 
	 * @param {this.client}	this.client 
	 * @return			True if user has permission to use the given command, False if not
	 */
	isPermitted (member, command)
	{
		if (this.isRateLimited(member.id)) { return false; }							// Too many commands in a short amount of time //
		if (!this.config.commands[command.name].permissionGroup) { return true; }	// Permission group isn't set //
		else																		// Permission group is set //
		{
			if (member.id == this.config.ownerID) { return true; }					// Always allow bot owner //
			
			let permissionGroup = this.config.permissionGroups[command.permissionGroup];
			if (permissionGroup.users.includes(member.id)) { return true; }			// User is included in user list //
			else
			{
				for (let role of permissionGroup.roles)
				{
					if (member.roles.keyArray().includes(role))	{ return true; }	// Any of the user's roles are in the role list // 
				}
			}
		}
		return false;
	}
	
	isRateLimited (userID)
	{
		return (userID in this.userLog && this.userLog[userID] >= this.config.commandAmountLimit)
	}

	incrementLogCount (userID)
	{
		if (userID in this.userLog) {
			this.userLog[userID]++;
		} else {
			this.userLog[userID] = 1
		}
		setTimeout(() => { this.decrementLogCount(userID) }, this.config.commandTimeLimit * 1000);
	}

	decrementLogCount (userID)
	{
		if (userID in this.userLog) {
			if (this.userLog[userID] > 0) { this.userLog[userID]--; }
			else { this.userLog[userID] = 0}
		}
	}

	rot13 (string) 
	{
		return string.replace(/[A-Za-z]/g, function (c)
		{
		  return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".charAt(
				 "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm".indexOf(c) 
				 );
		});
	}
}
