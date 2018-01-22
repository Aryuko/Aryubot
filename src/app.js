const Discord = require("discord.js");
var Functions = require("./functions.js");
const Credentials = require("../credentials.json");

let client = new Discord.Client();
client.login(Credentials.token);

client.once("ready", () => {
	console.log("Aryubot reporting for duty o7 currently serving", client.guilds.array().length, "server(s)!");
});

client.on("disconnected", () => {
	console.log("Client disconnected");
	process.exit(1);
});

client.on("message", (m) => Functions.handleMessage(m));
client.on("messageReactionAdd", (r, u) => Functions.handleReaction(r, u, client.user.id));