import * as WebSocket from 'ws';
import User from '../model/User';

export default class UserManager {
    /** 客端資料表 */
    private static _userMap: Map<string, User> = new Map();
    /**
     * 設置連線端的Client對應
     * @param pID clientID
     * @param client Client
     * @param strIp 客端ip
     */
    public static setUserClient(pID: string, client: WebSocket, strIp: string): void {
        if (this._userMap.has(pID)) {
            let user: User = this._userMap.get(pID);
            user.client = client;
        } else {
            let user = new User(pID);
            user.client = client;
            user.IP = strIp;
            this._userMap.set(pID, user);
        }
    }
    /**
     * 移除連線端資料
     * @param pID clientID
     */
    public static removeUser(pID: string): void {
        if (!this._userMap.has(pID)) {
            console.warn("UserManager remove Invalid ID");
        } else {
            this._userMap.delete(pID);
        }
    }
    /**
     * 取得連線端資料
     * @param pID clientID
     * @returns 連線端資料，不存在則回傳null
     */
    public static getUser(pID: string): User {
        if (pID == undefined || pID == null) {
            console.warn("UserManager get Invalid ID");
            return undefined;
        }
        if (this._userMap.has(pID)) {
            return this._userMap.get(pID);
        } else {
            return null;
        }
    }
}
