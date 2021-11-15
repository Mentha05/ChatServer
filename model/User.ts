import * as WebSocket from 'ws';
export default class User {
    constructor(ID) {
        this._ID = ID;
    }
    /** ClientID */
    private _ID: string = "";
    /** Client */
    private _client: WebSocket = null;
    /** 連線IP */
    private _iP: string = "";
    /**  */
    private _roomID: number = -1;
    public set client(client: WebSocket) {
        this._client = client;
    }
    public get client(): WebSocket {
        return this._client;
    }
    public set IP(strIp: string) {
        this._iP = strIp;
    }
    public get IP(): string {
        return this._iP;
    }
    public get roomID(): number {
        return this._roomID;
    }
    public set roomID(roomID: number) {
        this._roomID = roomID;
    }
}