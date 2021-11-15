import ChatManager from "../manager/ChatManager";
import SendPkgManager from "../manager/SendPkgManager";
import UserManager from "../manager/UserManager";
import Message from "./Message";

export default class Room {
    constructor(roomID) {
        this._roomID = roomID;
        this._peopleIDList = [];
        this._messageList = [];
    }
    /** 房間編號 */
    private _roomID: number;
    /** 房間內所有ID */
    private _peopleIDList: string[];
    /** 訊息列表 */
    private _messageList: Message[];
    public get peopleIDList(): string[] {
        return this._peopleIDList;
    }
    /**
     * 設置
     * @param clientID 
     */
    public setPeople(clientID: string) {
        this._peopleIDList.push(clientID);
    }
    /**
     * 設置歷史訊息
     * @param strMsg 
     * @param strName 
     * @param strColor 
     * @param nFontSize 
     */
    public initSetMsg(strMsg: string, strName: string, strColor: string, nFontSize: number): void {
        let messageData = new Message(strMsg, strName, strColor, nFontSize, Date.now());
        this._messageList.push(messageData);
    }
    /**
     * 記錄玩家送出的訊息
     * @param clientID 
     * @param strMsg 
     * @param strName 
     * @param strColor 
     * @param nFontSize 
     */
    public setMessage(clientID: string, strMsg: string, strName: string, strColor: string, nFontSize: number): void {
        try {
            let ip = UserManager.getUser(clientID).IP;
            ChatManager.insertChatMessage(this._roomID, strMsg, strName, strColor, nFontSize, ip);
            let messageData = new Message(strMsg, strName, strColor, nFontSize, Date.now(), clientID);
            this._messageList.push(messageData);
            this.peopleIDList.forEach((item: string) => {
                SendPkgManager.onMessage_Notify(item, messageData);
            });
        } catch (error) {
            console.log("setMessage error ", error);
        }
    }
    /**
     * 取得歷史紀錄
     * @returns 
     */
    public getMessage(): Message[] {
        return this._messageList;
    }
    /**
     * 從列表內移除該使用者
     * @param clientID 
     */
    public remove(clientID: string) {
        let index = this._peopleIDList.indexOf(clientID);
        if (index > -1) {
            this._peopleIDList.splice(index, 1);
        }
    }
    /**
     * 
     */
    public clearData() {
        this.peopleIDList.forEach((item: string) => {
            SendPkgManager.onLeaveRoom_Resp(item);
        });
        this._peopleIDList = [];
        this._messageList = [];
    }
}
