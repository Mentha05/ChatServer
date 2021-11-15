import { PktType } from "../enum/PktType";
import Message from "../model/Message";
import Room from "../model/Room";
import User from "../model/User";
import JoinRoomReqPkt from "../pkt/JoinRoomReqPkt";
import MessageReqPkt from "../pkt/MessageReqPkt";
import PktModel from "../pkt/PktModel";
import ChatManager from "./ChatManager";
import RoomManager from "./RoomManager";
import SendPkgManager from "./SendPkgManager";
import UserManager from "./UserManager";

/**
 * 收到封包後處理
 */
export default class ReceivePkgManager {
    /**
     * 封包解析
     * @param clientID client ID
     * @param typeString 封包編號
     * @param data client 送出的資料
     */
    public static resolvePkg(clientID: string, type: number, data: any) {
        if (type == PktType.LOGIN_REQ) this.onLogin_Req(clientID, data);
        if (type == PktType.JOINROOM_REQ) this.onJoinRoom_Req(clientID, data);
        if (type == PktType.MESSAGE_REQ) this.onMessage_Req(clientID, data);
        if (type == PktType.LEAVEROOM_REQ) this.onLeaveRoom_Req(clientID, data);
    }
    /**
     * 0x01 Client端請求登入
     * @param clientID client ID
     * @param data client 送出的資料
     */
    private static onLogin_Req(clientID: string, data: PktModel) { }

    /**
     * 0x02 Client端請求進入房間
     * @param clientID client ID
     * @param data client 送出的資料
     */
    private static onJoinRoom_Req(clientID: string, data: JoinRoomReqPkt) {
        console.log('onJoinRoom_Req', data);
        let room: Room = RoomManager.getRoom(data.roomID);
        let ret: number = 0;
        let messageData: Message[] = [];
        if (room != null) {
            let user: User = UserManager.getUser(clientID);
            user.roomID = data.roomID;
            room.setPeople(clientID);
            messageData = room.getMessage();
        }
        else ret = 404;
        SendPkgManager.onJoinRoom_Resp(clientID, ret, messageData);
    }
    /**
     * 0x05 client端發送訊息
     * @param clientID client ID
     * @param data client 送出的資料
     */
    private static onMessage_Req(clientID: string, data: MessageReqPkt) {
        console.log('onMessage_Req', data);
        let user: User = UserManager.getUser(clientID);
        let room: Room = RoomManager.getRoom(user.roomID);
        room.setMessage(clientID, data.Msg, data.Name, data.Color, data.FontSize);
    }
    /**
     * 0x07 client端離開房間
     * @param clientID client ID
     * @param data client 送出的資料
     */
    private static onLeaveRoom_Req(clientID: string, data: PktModel) {
        let user: User = UserManager.getUser(clientID);
        let room: Room = RoomManager.getRoom(user.roomID);
        room.remove(clientID);
        user.roomID = -1;
    }
}
