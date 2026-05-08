import {NodeJSSerialConnection, Constants, Message} from "@liamcottle/meshcore.js";
import {WebSocketServer} from "ws";
import * as process from "node:process";

// Check for environment variables
if (!process.env.SERIAL_PORT) {
	throw new Error("Missing SERIAL_PORT");
}

// Create connection to companion radio
const connection = new NodeJSSerialConnection(process.env.SERIAL_PORT);

// Create Web Socket
const wss = new WebSocketServer({ port: Number.parseInt(process.env.WS_PORT) });

wss.on('connection', (ws) => {
	ws.on('error', (err) => { console.error(err) });
});

// Initial Setup
const channelNames: string[] = [];

connection.on("connected", async () => {
	console.log("Connected to radio");
	const channels = await connection.getChannels();

	for (const channel of channels) {
		channelNames[channel.channelIdx] = channel.name;
	}
});

connection.on(Constants.PushCodes.MsgWaiting, async () => {
	try {
		const waitingMessages = await connection.getWaitingMessages();

		waitingMessages.forEach((message: Message) => {
			// Do not show DMs
			if (message.channelMessage) {
				// send channel messages
				const packet = {
					...message.channelMessage,
					channelName: channelNames[message.channelMessage.channelIdx],
				}
				console.log(packet);

				wss.clients.forEach(async (client) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify(packet));
					}
				});
			}
		});
	} catch (error) {
		console.log(error);
	}
});

connection.on("disconnected", async () => {
	console.log("Disconnected");
	await connection.connect();
});

// Connect to companion
connection.connect();
