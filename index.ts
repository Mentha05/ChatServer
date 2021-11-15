import * as WebSocket from 'ws';
import * as shortid from 'shortid';
import { IncomingMessage } from 'http';
import ReceivePkgManager from './manager/ReceivePkgManager';
import UserManager from './manager/UserManager';
import ChatManager from './manager/ChatManager';
import RoomManager from './manager/RoomManager';
const { Connection, Request, TYPES } = require("tedious");
var config = {
    server: 'sql server',
    authentication: {
        type: 'default',
        options: {
            userName: 'userName',
            password: 'password'
        }
    },
    options: {
        encrypt: true,
        database: 'DB Name'
    }
};

const connection = new Connection(config);
connection.on("connect", (err: { message: any; }) => {
    if (err) {
        console.error(err.message);
    } else {
        ChatManager.setConnection(connection);
        /**  WebSocket 伺服器 */
        const wsServer = new WebSocket.Server({ port: 10010 }, () => {
            console.log(`已啟動> 聊天伺服器。 Port: ${wsServer.address()['port']}`);
        });
        wsServer.on("connection", function connection(client, request: IncomingMessage) {
            let clientID = shortid.generate();    // 給 client 一個 uid;
            client['id'] = clientID;
            let ip = request.socket.remoteAddress;
            console.log(`客端ip ${ip} 已連線，clientID： ${clientID} 目前連線數量：${wsServer.clients.size}`);
            UserManager.setUserClient(clientID, client, ip);

            // 當 client 中斷連線
            client.on("close", function connection(socket, request) {
                let roomID = UserManager.getUser(client['id']).roomID;
                if (roomID != -1) {
                    let room = RoomManager.getRoom(roomID);
                    if (room != null)
                        room.remove(client['id']);
                }
                UserManager.removeUser(client['id']);
                console.log(`客端已離線，目前連線數量：${wsServer.clients.size}`);
            });

            // 當 client 送出訊息
            client.on("message", function incoming(message: Buffer) {
                let type: number = message.readUInt8();
                let typeString: string = "00" + type.toString(16).toUpperCase();
                type = Number('0x' + typeString.substr(-2, 2));
                let data: any = JSON.parse(message.slice(1).toString("utf8"));
                ReceivePkgManager.resolvePkg(client['id'], type, data);
            });
        });
    }
});

connection.connect();
