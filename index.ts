import { NodeJSSerialConnection, Constants } from "@liamcottle/meshcore.js";
import {WebSocketServer} from "ws";
import * as process from "node:process";

// Check for environment variables
if (!process.env.SERIAL_PORT) {
	throw new Error("Missing SERIAL_PORT");
}

// Create connection to companion radio
const connection = new NodeJSSerialConnection(process.env.SERIAL_PORT);

// Create Web Socket
const wss = new WebSocketServer({ port: process.env.WS_PORT });

wss.on('connection', (ws) => {
	ws.on('error', (err) => { console.error(err) });
});

// Initial Setup
connection.on("connected", async () => {
	console.log("Connected to radio");
});

connection.on(Constants.PushCodes.MsgWaiting, async () => {
	try {
		const waitingMessages = await connection.getWaitingMessages();

		waitingMessages.forEach((message: any) => {
			// Do not show DMs
			if (message.channelMessage) {
				// send channel messages
				console.log(message);
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
