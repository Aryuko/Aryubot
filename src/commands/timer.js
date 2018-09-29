const Command = require("../Command.js");

module.exports = new Command (
	"timer",
	(message, input, client) => 
	{
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
		
					} else
					{
						console.log("Incorrectly formatted time");
					}
					break;

				case "cancel":
				case "unset":
					if(client.Variables.timer.intervalObject)
					{
						clearInterval(client.Variables.timer.intervalObject);
						client.Variables.timer.intervalObject	= false;
						client.Variables.timer.registered		= false;
						client.Variables.timer.name				= false;
						client.Variables.timer.time				= false;
					}
					client.user.setPresence({ status: 'online', game: null});
					break;

				default:
					console.log("Incorrect input");
					break;
			}
		} else
		{
			// change to show current timer //
			console.log("Incorrect input");
		}
	},
	[],
	"Sets the bot status to a timer showing how long is left until the given event",
	"timer set <name of event> <time of event>",
	[]
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