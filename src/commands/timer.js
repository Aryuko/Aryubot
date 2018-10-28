const Command = require("../Command.js");

module.exports = new Command (
	// name: // 
	"timer",
	// init: // 
	(client) => 
	{
		client.Variables.timer =
		{
			"registered" : false,
			"name" : false,
			"time" : false,
			"intervalObject" : false
		}
		return true;
	},
	// method: // 
	(message, input, client) => 
	{
		let responseEmbed = new client.Discord.RichEmbed();
		if (input.args)
		{
			let mode = input.args[0];
			switch(mode)
			{
				case "set":
					let name = input.args[1];
					let time = new Date(input.args[2]);
					if(time.getHours()) 
					{
						if(client.Variables.timer.intervalObject)
						{
							clearInterval(client.Variables.timer.intervalObject);
						}
						let interval = setInterval(() =>
						{
							updateStatus(name, time, client);
						}, 60000);
						
						client.Variables.timer.intervalObject	= interval;
						client.Variables.timer.registered		= true;
						client.Variables.timer.name				= name;
						client.Variables.timer.time				= time;
						updateStatus(name, time, client);

						responseEmbed.setColor(client.Config.colours.success)
						.setTitle("Timer set")
						.setDescription("'" + name + "' set for " + time);
						message.channel.send(responseEmbed);
		
					} else // Incorrectly formatted time //
					{
						responseEmbed.setColor(client.Config.colours.fail)
						.setTitle("Incorrect input")
						.setDescription("Incorrectly formatted time");
						message.channel.send(responseEmbed);
					}
					break;

				case "cancel":
				case "unset":
					if(client.Variables.timer.intervalObject)
					{
						clearInterval(client.Variables.timer.intervalObject);
						client.Variables.timer.intervalObject = false;
					}
					client.Variables.timer.registered		= false;
					client.Variables.timer.name				= false;
					client.Variables.timer.time				= false;
					client.user.setPresence({ status: 'online', game: null});
					
					responseEmbed.setColor(client.Config.colours.success)
					.setTitle("Timer unset")
					.setDescription("The timer has now been unset");
					message.channel.send(responseEmbed);

					break;

				default: // Incorrect action argument //
					responseEmbed.setColor(client.Config.colours.fail)
					.setTitle("Incorrect input")
					.setDescription("Incorrect arguments, please use either ``set`` or ``unset`` as the second argument, or omit all arguments");
					message.channel.send(responseEmbed);
					break;
			}
		} else // No arguments set //
		{
			responseEmbed.setColor(client.Config.colours.success)
			.setTitle("Current timer");
			if(client.Variables.timer.registered)
			{
				let difference = client.Variables.timer.time - Date.now();
				if (difference > 0)
				{
					let timeString = timeConversion(difference);
					responseEmbed.setDescription(client.Variables.timer.name + ": in " + timeString);
				} else 
				{
					responseEmbed.setDescription(client.Variables.timer.name + ": right now");
				}
			}
			else { responseEmbed.setDescription("No timer set"); }
			
			message.channel.send(responseEmbed);
		}
	},
	// aliases: //
	[],
	// description: // 
	"Sets the bot status to a timer showing how long is left until the given event",
	// syntax: // 
	"timer <action> <name of event> <time of event>"
);
// ex: !timer set "test" "2018 Oct 29 22:40"

function timeConversion (millisec)
{
	var seconds = Math.floor(millisec / 1000);
	var minutes = Math.floor(millisec / (1000 * 60));
	var hours = Math.floor(millisec / (1000 * 60 * 60));
	var days = Math.floor(millisec / (1000 * 60 * 60 * 24));

	if (seconds < 60) {	return seconds + " seconds"; }
	else if (minutes < 60) { return minutes + " minutes"; }
	else if (hours < 24) { return hours + " hours"; }
	else { return days + " days" }
}

function updateStatus (name, time, client)
{
	let difference = time - Date.now();
	if (difference > 0)
	{
		let timeString = timeConversion(difference);
		client.user.setActivity(name + " in " + timeString, { type: 'WATCHING' });
	} else {
		clearInterval(client.Variables.timer.intervalObject);
		client.Variables.timer.intervalObject = false;

		client.user.setActivity(name + " right now!", { type: 'WATCHING' });
	}
}