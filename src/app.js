const Discord		= require("discord.js");
const Config		= require("./Config.js");
const Functions		= require("./functions.js");
const Credentials	= require("../credentials.json");
const loadFiles		= require("./loadFiles.js");

let client = new Discord.Client();

/* Extend client with Discord, Config, and Variables */
client.Config = new Config();

// client.Config.permissionGroups = {"test" : 1, "test3": 3};
client.Config.permissionGroups.test = 2;
client.Config.permissionGroups['test'] = 3;
// client.Config.save();
console.log("test from app.js: " + client.Config.permissionGroups.test);
console.log("config.test from app.js: " + client.Config.config.permissionGroups.test);
console.log("full config from app.js: ");
console.log(client.Config.config);

client.Discord = Discord;
client.Variables = {};

/* Load commands */ 
console.log("Loading commands...");
loadFiles("./src/commands").then((result) =>
{
	/* Extend client with commands */
	client.Commands = result.requires;
	
	/* Call the init function of each command and extend it with its own config */
	for (commandName in client.Commands)
	{
		let command = client.Commands[commandName];

		command.init(client);
		command.updateConfig(client.Config);
	}
	
	if (client.Commands.hasOwnProperty("examplecommand"))
	{
		if(client.Commands['examplecommand'].method())
		{ 
			console.log("Successfully loaded " + result.count + " commands. Use " + client.Config.commandPrefix + "commandlist to see all.");
		}
	} else
	{
		console.log("Something went wrong when loading commands");
	}
});

client.login(Credentials.token);

client.once("ready", () =>
{
	console.log("Penny is combat ready o7! Currently serving", client.guilds.size, "servers and " + client.users.size + " users.");
});

client.on("disconnected", () =>
{
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