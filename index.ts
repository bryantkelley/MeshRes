import {Constants, Message, NodeJSSerialConnection} from "@liamcottle/meshcore.js";
import {WebSocketServer} from "ws";
import * as process from "node:process";

// Check for environment variables
if (!process.env.SERIAL_PORT) {
    throw new Error("Missing SERIAL_PORT");
}

// Set allowed private channels. Channels beginning with an octothorpe are included by default.
const allowedPrivateChannels = ['Public'];

// Create connection to companion radio
const connection = new NodeJSSerialConnection(process.env.SERIAL_PORT);

// Create Web Socket
const wss = new WebSocketServer({port: Number.parseInt(process.env.WS_PORT)});

wss.on('connection', (ws) => {
    console.log('Client connected')
    ws.on('error', (err) => {
        console.error(err)
    });
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
                const packet: Message & { channelName: string } = {
                    ...message.channelMessage,
                    channelName: channelNames[message.channelMessage.channelIdx],
                }
                console.log(packet.channelName);
                if (packet.channelName.startsWith("#") || allowedPrivateChannels.includes(packet.channelName)) {
                    console.log(packet);
                    const separatorIndex = packet.text.trim().indexOf(":");
                    const senderName: string = packet.text.slice(0, separatorIndex);
                    const cleanedMessage: string = packet.text.slice(separatorIndex + 2);
                    const formattedDate = new Date(packet.senderTimestamp * 1000).toISOString();
                    const formattedPacket = `<size=40%>${packet.channelName} • ${formattedDate}</size><br><size=100%>${senderName}</size><br><size=80%>${cleanedMessage}</size>`;
                    console.log(formattedPacket);

                    wss.clients.forEach(async (client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(formattedPacket);
                        }
                    });
                }
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
