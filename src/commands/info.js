const Command = require("../Command.js");

module.exports = new Command (
    "info",
    (message, input, client) => 
    {
        let responseEmbed = new client.Discord.RichEmbed()
        .setColor(client.Config.colours.purple)
        .setAuthor(client.user.username, client.user.avatarURL, "https://github.com/Aryuko/Aryubot")
        .setDescription("Salutations! My name is Penny, and I'm here to help :D")
        .addField("Development", "My development is currently a work in progress. If you want, you can view my code and contribute on [GitHub](https://github.com/Aryuko/Aryubot)!", true)
        .addField("Version", "I'm not really sure which version I am, I haven't been programmed to know yet :(", true)
        .addField("Author", "I'm being developed by someone called Aryu, you can find and contact her at the links below!\n[Reddit](https://www.reddit.com/user/Aryuko) | [Twitter](https://twitter.com/Aryuuko) | [Tumblr](http://pachimaryu.tumblr.com/) | [Steam](https://steamcommunity.com/id/Aryuuu/)")
        .setFooter("Serving " + client.guilds.size + " servers with a combined total of " + client.users.size + " users.\nCurrent uninterrupted uptime: " + timeConversion(client.uptime));
        message.channel.send(responseEmbed);
    },
    [],
    "A command that shows some info about the bot and its author.",
    "info",
    []
);

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