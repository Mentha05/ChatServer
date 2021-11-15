import Room from "../model/Room";
import ChatManager from "./ChatManager";

export default class RoomManager {
    private static _roomMap: Map<number, Room> = new Map();
    public static setRoom(index: number): void {
        if (this._roomMap.has(index)) {
            console.warn("RoomManager set repeat room index");
        } else {
            this._roomMap.set(index, new Room(index));
        }
    }

    public static initMessage() {
        for (let key of this._roomMap.keys()) {
            ChatManager.queryMessage(key)
        }
    }
    /**
     * 根據編號取得房間
     */
    public static getRoom(index: number): Room {
        if (index == undefined || index == null) {
            console.warn("RoomManager get Invalid room index");
            return undefined;
        }
        if (this._roomMap.has(index)) {
            return this._roomMap.get(index);
        } else {
            return null;
        }
    }

    /**
     * 移除房間資料
     * @param index
     */
    public static removeRoom(index: number): void {
        if (!this._roomMap.has(index)) {
            console.warn("RoomManager remove Invalid room index");
        } else {
            this._roomMap.get(index).clearData();
            this._roomMap.delete(index);
        }
    }

    public static clearData() {
        this._roomMap.clear();
    }
}