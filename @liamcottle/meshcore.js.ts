declare module "@liamcottle/meshcore.js" {
    class BufferWriter {
        constructor();

        toBytes(): Uint8Array<ArrayBuffer>;

        writeBytes(bytes: Uint8Array<ArrayBuffer>): void;

        writeUInt16LE(num: number): void;

        writeUInt32LE(num: number): void;

        writeInt32LE(num: number): void;

        writeString(string: string): void;

        writeCString(string: string, maxLength: number): void;
    }

    class BufferReader {
        constructor(data: any);

        getRemainingBytesCount(): number;

        readByte(): number;

        readBytes(count: number): Uint8Array<ArrayBuffer>;

        readRemainingBytes(): Uint8Array<ArrayBuffer>;

        readString(): string;

        readCString(maxLength: number): string | undefined;

        readInt8(): number;

        readUInt8(): number;

        readUInt16LE(): number;

        readUInt16BE(): number;

        readUInt32LE(): number;

        readUInt32BE(): number;

        readInt16LE(): number;

        readInt16BE(): number;

        readInt32LE(): number;

        readInt24BE(): number;
    }

    interface Channel {
        channelIdx: number;
    }

    interface Contact {
        publicKey: Uint8Array<ArrayBuffer>;
        type: number;
        flags: number;
        outPathLen: number;
        outPath: Uint8Array<ArrayBuffer>;
        advName: string;
        lastAdvert: number;
        advLat: number;
        advLon: number;
    }

    type ChannelMessage = {
        channelIdx: number;
        pathLen: number;
        txtTypes: number;
        senderTimestamp: number;
        text: string;
    }

    type ContactMessage = {
        channelIdx: number;
        pathLen: number;
        txtTypes: number;
        senderTimestamp: number;
        text: string;
    }

    type Message = { contactMessage: ContactMessage } | { channelMessage: ChannelMessage } | null;

    interface RepeaterStats {
        batt_milli_volts: number;
        curr_tx_queue_len: number;
        noise_floor: number;
        last_rssi: number;
        n_packets_recv: number;
        n_packets_sent: number;
        total_air_time_secs: number;
        total_up_time_secs: number;
        n_sent_flood: number;
        n_sent_direct: number;
        n_recv_flood: number;
        n_recv_direct: number;
        err_events: number;
        last_snr: number;
        n_direct_dups: number;
        n_flood_dups: number;
    }

    class EventEmitter {
        constructor();

        on(event: any, callback: any): void;

        off(event: any, callback: any): void;

        once(event: any, callback: any): void;

        emit(event: any, ...data: any[]): void;
    }

    // Connection
    class Connection extends EventEmitter {
        onConnected(): Promise<void>;

        onDisconnected(): void;

        close(): void | Promise<void>;

        // throws an error because it should be implemented by the subclass
        sendToRadioFrame(data: unknown): Promise<void>;

        sendCommandAppStart(): Promise<void>;

        sendCommandSendTxtMsg(
            txtType: number,
            attempt: number,
            senderTimestamp: number,
            pubKeyPrefix: number[],
            text: string
        ): Promise<void>;

        sendCommandSendChannelTxtMsg(
            txtType: number,
            channelIdx: number,
            senderTimestamp: number,
            text: string
        ): Promise<void>;

        sendCommandGetContacts(since?: number): Promise<void>;

        sendCommandGetDeviceTime(): Promise<void>;

        sendCommandSetDeviceTime(epochSecs: number): Promise<void>;

        sendCommandSendSelfAdvert(type: number): Promise<void>;

        sendCommandSetAdvertName(name: string): Promise<void>;

        sendCommandAddUpdateContact(
            publicKey: Uint8Array<ArrayBuffer>,
            type: number,
            flags: number,
            outPathLen: number,
            outPath: Uint8Array<ArrayBuffer>,
            advName: string,
            lastAdvert: number,
            advLat: number,
            advLon: number
        ): Promise<void>;

        sendCommandSyncNextMessage(): Promise<void>;

        sendCommandSetRadioParams(
            radioFreq: number,
            radioBw: number,
            radioSf: number,
            radioCr: number
        ): Promise<void>;

        sendCommandSetTxPower(txPower: number): Promise<void>;

        sendCommandResetPath(pubKey: Uint8Array<ArrayBuffer>): Promise<void>;

        sendCommandSetAdvertLatLon(lat: number, lon: number): Promise<void>;

        sendCommandRemoveContact(pubKey: Uint8Array<ArrayBuffer>): Promise<void>;

        sendCommandShareContact(pubKey: Uint8Array<ArrayBuffer>): Promise<void>;

        sendCommandExportContact(pubKey?: Uint8Array<ArrayBuffer> | null): Promise<void>;

        sendCommandImportContact(advertPacketBytes: Uint8Array<ArrayBuffer>): Promise<void>;

        sendCommandReboot(): Promise<void>;

        sendCommandGetBatteryVoltage(): Promise<void>;

        sendCommandDeviceQuery(appTargetVer: number): Promise<void>;

        sendCommandExportPrivateKey(): Promise<void>;

        sendCommandImportPrivateKey(privateKey: Uint8Array<ArrayBuffer>): Promise<void>;

        sendCommandSendRawData(
            path: Uint8Array<ArrayBuffer>,
            rawData: Uint8Array<ArrayBuffer>
        ): Promise<void>;

        sendCommandSendLogin(publicKey: Uint8Array<ArrayBuffer>, password: string): Promise<void>;

        sendCommandSendStatusReq(publicKey: Uint8Array<ArrayBuffer>): Promise<void>;

        sendCommandSendTelemetryReq(publicKey: Uint8Array<ArrayBuffer>): Promise<void>;

        sendCommandSendBinaryReq(
            publicKey: Uint8Array<ArrayBuffer>,
            requestCodeAndParams: Uint8Array<ArrayBuffer>
        ): Promise<void>;

        sendCommandGetChannel(channelIdx: number): Promise<void>;

        sendCommandSetChannel(
            channelIdx: number,
            name: string,
            secret: Uint8Array<ArrayBuffer>
        ): Promise<void>;

        sendCommandSendTracePath(
            tag: number,
            auth: number,
            path: Uint8Array<ArrayBuffer>
        ): Promise<void>;

        sendCommandSetOtherParams(manualAddContacts: boolean): Promise<void>;

        onFrameReceived(frame: any): Promise<void>;

        onAdvertPush(bufferReader: BufferReader): void;

        onPathUpdatedPush(bufferReader: BufferReader): void;

        onSendConfirmedPush(bufferReader: BufferReader): void;

        onMsgWaitingPush(bufferReader: BufferReader): void;

        onRawDataPush(bufferReader: BufferReader): void;

        onLoginSuccessPush(bufferReader: BufferReader): void;

        onStatusResponsePush(bufferReader: BufferReader): void;

        onLogRxDataPush(bufferReader: BufferReader): void;

        onTelemetryResponsePush(bufferReader: BufferReader): void;

        onBinaryResponsePush(bufferReader: BufferReader): void;

        onTraceDataPush(bufferReader: BufferReader): void;

        onNewAdvertPush(bufferReader: BufferReader): void;

        onOkResponse(bufferReader: BufferReader): void;

        onErrResponse(bufferReader: BufferReader): void;

        onContactsStartResponse(bufferReader: BufferReader): void;

        onContactResponse(bufferReader: BufferReader): void;

        onEndOfContactsResponse(bufferReader: BufferReader): void;

        onSentResponse(bufferReader: BufferReader): void;

        onExportContactResponse(bufferReader: BufferReader): void;

        onBatteryVoltageResponse(bufferReader: BufferReader): void;

        onDeviceInfoResponse(bufferReader: BufferReader): void;

        onPrivateKeyResponse(bufferReader: BufferReader): void;

        onDisabledResponse(bufferReader: BufferReader): void;

        onChannelInfoResponse(bufferReader: BufferReader): void;

        onSelfInfoResponse(bufferReader: BufferReader): void;

        onCurrTimeResponse(bufferReader: BufferReader): void;

        onNoMoreMessagesResponse(bufferReader: BufferReader): void;

        onContactMsgRecvResponse(bufferReader: BufferReader): void;

        onChannelMsgRecvResponse(bufferReader: BufferReader): void;

        getSelfInfo(timeoutMillis: number): Promise<void>;

        sendAdvert(type: number): Promise<void>;

        sendFloodAdvert(): Promise<void>;

        sendZeroHopAdvert(): Promise<void>;

        setAdvertName(name: string): Promise<void>;

        setAdvertLatLong(latitude: number, longitude: number): Promise<void>;

        setTxPower(txPower: number): Promise<void>;

        setRadioParams(
            radioFreq: number,
            radioBw: number,
            radioSf: number,
            radioCr: number
        ): Promise<void>;

        getContacts(): Promise<Contact[]>;

        findContactByName(name: string): Promise<Contact | undefined>;

        findContactByPublicKeyPrefix(
            pubKeyPrefix: Uint8Array<ArrayBuffer>
        ): Promise<Contact | undefined>;

        sendTextMessage(
            contactPublicKey: Uint8Array<ArrayBuffer>,
            text: string,
            type: number
        ): Promise<any>; // response type?
        sendChannelTextMessage(channelIdx: number, text: string): Promise<void>;

        syncNextMessage(): Promise<Message>;

        getWaitingMessages(): Promise<Message[]>;

        getDeviceTime(): Promise<any>;

        setDeviceTime(epochSecs: number): Promise<any>;

        syncDeviceTime(): Promise<void>;

        importContact(advertPacketBytes: Uint8Array<ArrayBuffer>): Promise<any>;

        exportContact(pubKey?: Uint8Array<ArrayBuffer> | null): Promise<any>;

        shareContact(pubKey: Uint8Array<ArrayBuffer>): Promise<any>;

        removeContact(pubKey: Uint8Array<ArrayBuffer>): Promise<any>;

        addOrUpdateContact(
            publicKey: Uint8Array<ArrayBuffer>,
            type: number,
            flags: number,
            outPathLen: number,
            outPath: Uint8Array<ArrayBuffer>,
            advName: string,
            lastAdvert: number,
            advLat: number,
            advLon: number
        ): Promise<void>;

        setContactPath(contact: Contact, path: number): Promise<void>;

        resetPath(pubKey: Uint8Array<ArrayBuffer>): Promise<void>;

        reboot(): Promise<void>;

        getBatteryVoltage(): Promise<any>;

        deviceQuery(appTargetVer: number): Promise<any>;

        exportPrivateKey(): Promise<any>;

        importPrivateKey(privateKey: Uint8Array<ArrayBuffer>): Promise<any>;

        login(
            contactPublicKey: Uint8Array<ArrayBuffer>,
            password: string,
            extraTimeoutMillis?: number
        ): Promise<any>;

        getStatus(
            contactPublicKey: Uint8Array<ArrayBuffer>,
            extraTimeoutMillis?: number
        ): Promise<RepeaterStats>;

        getTelemetry(
            contactPublicKey: Uint8Array<ArrayBuffer>,
            extraTimeoutMillis?: number
        ): Promise<any>;

        sendBinaryRequest(
            contactPublicKey: Uint8Array<ArrayBuffer>,
            requestCodeAndParams: Uint8Array<ArrayBuffer>,
            extraTimeoutMillis?: number
        ): Promise<any>;

        /** @deprecated */
        pingRepeaterZeroHop(
            contactPublicKey: Uint8Array<ArrayBuffer>,
            timeoutMillis: number
        ): Promise<{
            rtt: number;
            snr: number;
            rssi: number;
        }>;

        getChannel(channelIdx: number): Promise<Channel>;

        setChannel(channelIdx: number, name: string, secret: Uint8Array<ArrayBuffer>): Promise<void>;

        deleteChannel(channelIdx: number): Promise<void>;

        getChannels(): Promise<Channel[]>;

        findChannelByName(name: string): Promise<Channel>;

        findChannelBySecret(secret: Uint8Array<ArrayBuffer>): Promise<Channel>;

        tracePath(path: Uint8Array<ArrayBuffer>, extraTimeoutMillis?: number): Promise<any>;

        setOtherParams(manualAddContacts: boolean): Promise<void>;

        setAutoAddContacts(): Promise<void>;

        setManualAddContacts(): Promise<void>;

        getNeighbours(
            publicKey: Uint8Array<ArrayBuffer>,
            count?: number,
            offset?: number,
            orderBy?: 0 | 1 | 2 | 3, // 0=newest_to_oldest, 1=oldest_to_newest, 2=strongest_to_weakest, 3=weakest_to_strongest
            pubKeyPrefixLength?: number
        ): Promise<{
            totalNeighboursCount: number;
            neighbours: {
                publicKeyPrefix: Uint8Array<ArrayBuffer>;
                heardSecondsAgo: number;
                snr: number;
            }[];
        }>;
    }

    // WebBleConnection
    class WebBleConnection extends Connection {
        constructor(bleDevice: any); // Navigator.bluetooth.requestDevice
        open(): Promise<WebBleConnection | null | undefined>;

        init(): Promise<void>;

        close(): Promise<void>;

        write(bytes: Uint8Array<ArrayBuffer>): Promise<void>;

        sendToRadioFrame(frame: Uint8Array<ArrayBuffer>): Promise<void>;
    }

    // SerialConnection
    class SerialConnection extends Connection {
        constructor();

        write(bytes: unknown): void;

        writeFrame(frameType: number, frameData: Uint8Array<ArrayBuffer>): Promise<void>;

        sendToRadioFrame(data: Uint8Array<ArrayBuffer>): Promise<void>;

        onDataReceived(value: Uint8Array<ArrayBuffer>): Promise<void>;
    }

    // NodeJSSerialConnection
    class NodeJSSerialConnection extends SerialConnection {
        constructor(path: string);

        connect(): Promise<void>;

        close(): Promise<void>;

        write(bytes: any): Promise<void>;
    }

    // WebSerialConnection
    class WebSerialConnection extends SerialConnection {
        constructor(serialPort: any); // Serial
        open(): Promise<WebSerialConnection>;

        close(): Promise<void>;

        write(bytes: any): Promise<void>;

        readLoop(): Promise<void>;
    }

    // TCPConnection
    class TCPConnection extends Connection {
        constructor(host: string, port: string);

        onSocketDataReceived(data: any): void;

        close(): void;

        write(bytes: any): Promise<void>;

        writeFrame(frameType: number, frameData: Uint8Array<ArrayBuffer>): Promise<void>;

        sendToRadioFrame(data: Uint8Array<ArrayBuffer>): Promise<void>;
    }

    // Constants
    class Constants {
        SupportedCompanionProtocolVersion: 1;

        static SerialFrameTypes: {
            Incoming: 0x3e; // ">"
            Outgoing: 0x3c; // "<"
        };

        static Ble: {
            ServiceUuid: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
            CharacteristicUuidRx: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
            CharacteristicUuidTx: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
        };

        static CommandCodes: {
            AppStart: 1;
            SendTxtMsg: 2;
            SendChannelTxtMsg: 3;
            GetContacts: 4;
            GetDeviceTime: 5;
            SetDeviceTime: 6;
            SendSelfAdvert: 7;
            SetAdvertName: 8;
            AddUpdateContact: 9;
            SyncNextMessage: 10;
            SetRadioParams: 11;
            SetTxPower: 12;
            ResetPath: 13;
            SetAdvertLatLon: 14;
            RemoveContact: 15;
            ShareContact: 16;
            ExportContact: 17;
            ImportContact: 18;
            Reboot: 19;
            GetBatteryVoltage: 20;
            SetTuningParams: 21; // todo
            DeviceQuery: 22;
            ExportPrivateKey: 23;
            ImportPrivateKey: 24;
            SendRawData: 25;
            SendLogin: 26; // todo
            SendStatusReq: 27; // todo
            GetChannel: 31;
            SetChannel: 32;
            // todo sign commands
            SendTracePath: 36;
            // todo set device pin command
            SetOtherParams: 38;
            SendTelemetryReq: 39;

            SendBinaryReq: 50;
        };

        static ResponseCodes: {
            Ok: 0; // todo
            Err: 1; // todo
            ContactsStart: 2;
            Contact: 3;
            EndOfContacts: 4;
            SelfInfo: 5;
            Sent: 6;
            ContactMsgRecv: 7;
            ChannelMsgRecv: 8;
            CurrTime: 9;
            NoMoreMessages: 10;
            ExportContact: 11;
            BatteryVoltage: 12;
            DeviceInfo: 13;
            PrivateKey: 14;
            Disabled: 15;
            ChannelInfo: 18;
        };

        static PushCodes: {
            Advert: 0x80; // when companion is set to auto add contacts
            PathUpdated: 0x81;
            SendConfirmed: 0x82;
            MsgWaiting: 0x83;
            RawData: 0x84;
            LoginSuccess: 0x85;
            LoginFail: 0x86; // not usable yet
            StatusResponse: 0x87;
            LogRxData: 0x88;
            TraceData: 0x89;
            NewAdvert: 0x8a; // when companion is set to manually add contacts
            TelemetryResponse: 0x8b;
            BinaryResponse: 0x8c;
        };

        static ErrorCodes: {
            UnsupportedCmd: 1;
            NotFound: 2;
            TableFull: 3;
            BadState: 4;
            FileIoError: 5;
            IllegalArg: 6;
        };

        static AdvType: {
            None: 0;
            Chat: 1;
            Repeater: 2;
            Room: 3;
        };

        static SelfAdvertTypes: {
            ZeroHop: 0;
            Flood: 1;
        };

        static TxtTypes: {
            Plain: 0;
            CliData: 1;
            SignedPlain: 2;
        };

        static BinaryRequestTypes: {
            GetTelemetryData: 0x03; // #define REQ_TYPE_GET_TELEMETRY_DATA 0x03
            GetAvgMinMax: 0x04; // #define REQ_TYPE_GET_AVG_MIN_MAX 0x04
            GetAccessList: 0x05; // #define REQ_TYPE_GET_ACCESS_LIST 0x05
            GetNeighbours: 0x06; // #define REQ_TYPE_GET_NEIGHBOURS 0x06
        };
    }

    // Advert
    type TypeString = "NONE" | "CHAT" | "REPEATER" | "ROOM" | null;

    class Advert {
        static ADV_TYPE_NONE: 0;
        static ADV_TYPE_CHAT: 1;
        static ADV_TYPE_REPEATER: 2;
        static ADV_TYPE_ROOM: 3;

        static ADV_LATLON_MASK: 0x10;
        static ADV_BATTERY_MASK: 0x20;
        static ADV_TEMPERATURE_MASK: 0x40;
        static ADV_NAME_MASK: 0x80;

        constructor(
            publicKey: Uint8Array<ArrayBuffer>,
            timestamp: number,
            signature: Uint8Array<ArrayBuffer>,
            appData: Uint8Array<ArrayBuffer>
        );

        static fromBytes(bytes: any): Advert;

        getFlags(): number;

        getType(): number;

        getTypeString(): TypeString;

        isVerified(): Promise<boolean>;

        parseAppData(): {
            type: TypeString;
            lat: number | null;
            long: number | null;
            name: string | null;
        };
    }

    // Packet
    class Packet {
        static PH_ROUTE_MASK: 0x03;
        static PH_TYPE_SHIFT: 2;
        static PH_TYPE_MASK: 0x0f;
        static PH_VER_SHIFT: 6;
        static PH_VER_MASK: 0x03;

        static ROUTE_TYPE_RESERVED1: 0x00;
        static ROUTE_TYPE_FLOOD: 0x01;
        static ROUTE_TYPE_DIRECT: 0x02;
        static ROUTE_TYPE_RESERVED2: 0x03;

        static PAYLOAD_TYPE_REQ: 0x00;
        static PAYLOAD_TYPE_RESPONSE: 0x01;
        static PAYLOAD_TYPE_TXT_MSG: 0x02;
        static PAYLOAD_TYPE_ACK: 0x03;
        static PAYLOAD_TYPE_ADVERT: 0x04;
        static PAYLOAD_TYPE_GRP_TXT: 0x05;
        static PAYLOAD_TYPE_GRP_DATA: 0x06;
        static PAYLOAD_TYPE_ANON_REQ: 0x07;
        static PAYLOAD_TYPE_PATH: 0x08;
        static PAYLOAD_TYPE_TRACE: 0x09;
        static PAYLOAD_TYPE_RAW_CUSTOM: 0x0f;

        constructor(header: number, path: Uint8Array<ArrayBuffer>, payload: Uint8Array<ArrayBuffer>);

        fromBytes(bytes: any): Packet;

        getRouteType(): number;

        getRouteTypeString(): "FLOOD" | "DIRECT" | null;

        isRouteFlood(): boolean;

        isRouteDirect(): boolean;

        getPayloadType(): number;

        getPayloadTypeString():
            | "REQ"
            | "RESPONSE"
            | "TXT_MSG"
            | "ACK"
            | "ADVERT"
            | "GRP_TXT"
            | "GRP_DATA"
            | "ANON_REQ"
            | "PATH"
            | "TRACE"
            | "RAW_CUSTOM"
            | null;

        getPayloadVer(): number;

        markDoNotRetransmit(): void;

        isMarkedDoNotRetransmit(): boolean;

        parsePayload():
            | {
            src: number;
            dest: number;
        }
            | {
            src: number;
            dest: number;
            encrypted: Uint8Array<ArrayBuffer>;
        }
            | {
            ack_code: any;
        }
            | {
            public_key: any;
            timestamp: any;
            app_data: {
                type: string | null;
                lat: number | null;
                lon: number | null;
                name: string | null;
            };
        }
            | {
            src: Uint8Array<ArrayBuffer>;
            dest: number;
        }
            | null;

        parsePayloadTypePath(): {
            src: number;
            dest: number;
        };

        parsePayloadTypeReq(): {
            src: number;
            dest: number;
            encrypted: Uint8Array<ArrayBuffer>;
        };

        parsePayloadTypeResponse(): {
            src: number;
            dest: number;
        };

        parsePayloadTypeTxtMsg(): {
            src: number;
            dest: number;
        };

        parsePayloadTypeAck(): {
            ack_code: any;
        };

        parsePayloadTypeAdvert(): {
            public_key: any;
            timestamp: any;
            app_data: {
                type: string | null;
                lat: number | null;
                lon: number | null;
                name: string | null;
            };
        };

        parsePayloadTypeAnonReq(): {
            src: Uint8Array<ArrayBuffer>;
            dest: number;
        };
    }

    // BufferUtils
    class BufferUtils {
        bytesToHex(uint8Array: Uint8Array<ArrayBuffer>): string;

        hexToBytes(hex: string): Uint8Array<ArrayBuffer>;

        base64ToBytes(base64: string): Uint8Array<ArrayBuffer>;

        areBuffersEqual(byteArray1: any, byteArray2: any): boolean;
    }

    // CayenneLpp
    class CayenneLpp {
        static LPP_DIGITAL_INPUT: 0;
        static LPP_DIGITAL_OUTPUT: 1;
        static LPP_ANALOG_INPUT: 2;
        static LPP_ANALOG_OUTPUT: 3;
        static LPP_GENERIC_SENSOR: 100;
        static LPP_LUMINOSITY: 101;
        static LPP_PRESENCE: 102;
        static LPP_TEMPERATURE: 103;
        static LPP_RELATIVE_HUMIDITY: 104;
        static LPP_ACCELEROMETER: 113;
        static LPP_BAROMETRIC_PRESSURE: 115;
        static LPP_VOLTAGE: 116;
        static LPP_CURRENT: 117;
        static LPP_FREQUENCY: 118;
        static LPP_PERCENTAGE: 120;
        static LPP_ALTITUDE: 121;
        static LPP_CONCENTRATION: 125;
        static LPP_POWER: 128;
        static LPP_DISTANCE: 130;
        static LPP_ENERGY: 131;
        static LPP_DIRECTION: 132;
        static LPP_UNIXTIME: 133;
        static LPP_GYROMETER: 134;
        static LPP_COLOUR: 135;
        static LPP_GPS: 136;
        static LPP_SWITCH: 142;
        static LPP_POLYLINE: 240;

        static parse(bytes: any): (
            | {
            channel: number;
            type: number;
            value: number;
        }
            | {
            channel: number;
            type: 136; // LPP_GPS
            value: {
                latitude: number;
                longitude: number;
                altitude: number;
            };
        }
            )[];
    }
}
