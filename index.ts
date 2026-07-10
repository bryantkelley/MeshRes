import {
  ChannelMessage,
  Constants,
  Message,
  NodeJSSerialConnection,
} from "@liamcottle/meshcore.js";
import { WebSocketServer } from "ws";
import * as process from "node:process";

// Check for environment variables
if (!process.env.SERIAL_PORT) {
  console.error("Missing SERIAL_PORT");
  process.exit(1);
}

let wsPort;
if (!process.env.WS_PORT) {
  console.log("No WS_PORT provided. Using 3017.");
  wsPort = 3017;
} else {
  wsPort = Number.parseInt(process.env.WS_PORT);
}

// Set allowed private channels. Channels beginning with an octothorpe are included by default.
const allowedPrivateChannels = ["Public"];

// Create connection to companion radio
const connection = new NodeJSSerialConnection(process.env.SERIAL_PORT);

// Create Web Socket
const wss = new WebSocketServer({ port: wsPort });

wss.on("connection", async (ws) => {
  console.log("Client connected");
  ws.on("error", (err) => {
    console.error(err);
  });

  ws.on('message', async function message(data: any) {
    await relayWSMessage(data);
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

const relayWSMessage = async (data: any) => {
  let stringData = data.toString();
  console.log('received from ws:', stringData);

  const sliceData = () => {
    const separatorIndex = stringData.indexOf(";");
    const sectionLength = Number.parseInt(stringData.slice(0, separatorIndex));
    const sectionEndIndex = separatorIndex + 1 + sectionLength;
    const section = stringData.substring(separatorIndex + 1, sectionEndIndex);
    stringData = stringData.substring(sectionEndIndex + 1);
    return section;
  };

  const relayChannel = sliceData();
  const relaySender = sliceData();
  const relayMessage = sliceData();

  const { channelIdx } = await connection.findChannelByName(relayChannel);

  setTimeout(async () => {
    await connection.sendChannelTextMessage(channelIdx, `${relaySender}: ${relayMessage}`);
  }, 5000);
}

connection.on(Constants.PushCodes.MsgWaiting, async () => {
  try {
    const waitingMessages = await connection.getWaitingMessages();

    waitingMessages.forEach((message: Message) => {
      if (message) {
        // Do not show DMs
        if (Object.keys(message).includes("channelMessage")) {
          const { channelMessage } = message as {
            channelMessage: ChannelMessage;
          };
          // send channel messages
          const packet: ChannelMessage & { channelName: string } = {
            ...channelMessage,
            channelName: channelNames[channelMessage.channelIdx],
          };

          if (
            packet.channelName.startsWith("#") ||
            allowedPrivateChannels.includes(packet.channelName)
          ) {
            const separatorIndex = packet.text.trim().indexOf(":");
            const senderName: string = packet.text.slice(0, separatorIndex);
            const cleanedMessage: string = packet.text.slice(
              separatorIndex + 2,
            );
            const formattedDate = new Date(
              packet.senderTimestamp * 1000,
            ).toISOString();

            // character count before each piece, semicolons between pieces
            // order of parts: channel, time, sender, message
            //
            // Example: `6;Public;24;2026-07-06T18:35:00.000Z;6;moss 🦌;6;howdy!`
            const formattedPacket = `${packet.channelName.length};${packet.channelName};${formattedDate.length};${formattedDate};${senderName.length};${senderName};${cleanedMessage.length};${cleanedMessage}`;
            console.log('sending to ws:', formattedPacket);

            wss.clients.forEach(async (client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(formattedPacket);
              }
            });
          }
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
