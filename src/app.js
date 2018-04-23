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

client.on("message", (message) => Functions.handleMessage(message));
client.on("messageReactionAdd", (reaction, user) => Functions.handleReaction(reaction, user, client.user.id));