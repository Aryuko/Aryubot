const Discord = require("discord.js");
var Functions = require("./functions.js");
const Credentials = require("../credentials.json");

let client = new Discord.Client();
client.login(Credentials.token);

client.once("ready", () => {
	console.log("Aryubot reporting for duty o7 currently serving", client.guilds.size, "servers and " + client.users.size + " users!");
});

client.on("disconnected", () => {
	console.log("Client disconnected");
	process.exit(1);
});

client.on("message", (message) => Functions.handleMessage(message, client));
client.on("messageReactionAdd", (reaction, user) => Functions.handleReaction(reaction, user, client));

/*
	Following code allows message reaction events to also work on non-caches messages.
	Code borrowed from: https://discordjs.guide/#/popular-topics/reactions?id=listening-for-reactions-on-old-messages
*/
const events = 
{
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MeSSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

client.on("raw", async event => 
{
	if (!events.hasOwnProperty(event.t)) return;
	
	const { d: data } = event;
	const user = client.users.get(data.user_id);
	const channel = client.channels.get(data.channel_id) || await user.createDM();

	if (channel.messages.has(data.message_id)) return;

	const message = await channel.fetchMessage(data.message_id);
	const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
	const reaction = message.reactions.get(emojiKey);

	client.emit(events[event.t], reaction, user);
});