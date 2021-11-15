import { PktType } from "../enum/PktType";
import Message from "../model/Message";
import User from '../model/User';
import MessageNotifyPkt from "../pkt/MessageNotifyPkt";
import JoinRoomRespPkt from "../pkt/JoinRoomRespPkt";
import PktModel from "../pkt/PktModel";
import UserManager from './UserManager';

export default class SendPkgManager {
    static SN = 1;
    /**
     * 0x02 回復Client登入
     * @param clientId 
     * @param ret
     */
    public static onLogin_Resp(clientID: string, ret: number) {

    }
    /**
     * 0x04 回復Client進入房間
     * @param clientID 
     * @param ret 
     * @param messageData 
     */
    public static onJoinRoom_Resp(clientID: string, ret: number, messageData: Message[]) {
        let data: JoinRoomRespPkt = new JoinRoomRespPkt();
        data.Ret = ret;
        data.SN = this.SN;
        this.SN++;
        data.TimeStamp = new Date().getTime();
        data.messageData = messageData;
        // console.log('onJoinRoom_Resp', JSON.stringify(data));
        this.send(clientID, PktType.JOINROOM_RESP, data);
    }
    public static onMessage_Notify(clientID: string, messageData: Message) {
        let data: MessageNotifyPkt = new MessageNotifyPkt();
        data.SN = this.SN;
        this.SN++;
        data.TimeStamp = new Date().getTime();
        data.messageData = messageData;
        // console.log('onMessage_Notify', JSON.stringify(data));
        this.send(clientID, PktType.MESSAGE_NOTIFY, data);
    }
    public static onLeaveRoom_Resp(clientID: string) {
        let data: PktModel = new PktModel();
        // data.Ret = ret;
        data.SN = this.SN;
        this.SN++;
        data.TimeStamp = new Date().getTime();
        this.send(clientID, PktType.LOGIN_RESP, data);
    }

    /**
     * 封包送出處理
     * @param clientID 要傳送的連線端
     * @param type 封包編號
     * @param data 資料
     */
    private static send(clientID: string, type: number, data: any) {
        let typebuf = Buffer.from([type]);
        let dataBuffer = Buffer.from(JSON.stringify(data), "utf8");
        let replyBuffer = Buffer.concat([typebuf, dataBuffer]);
        let user: User = UserManager.getUser(clientID);
        if (user != null) {
            user.client.send(replyBuffer);
        }
    }
}