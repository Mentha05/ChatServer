import RoomManager from "./RoomManager";

const { Connection, Request, TYPES } = require("tedious");

export default class ChatManager {
    private static connection: { execSql: (arg0: any) => void; };
    private static arWait: Array<Request> = [];
    public static setConnection(_connection: any): void {
        this.connection = _connection;
    }
    public static queryMessage(_roomID) {
        let strSQL = "select * from [Message] where ID =" + _roomID;
        var request = new Request(strSQL, (err: { message: any; }, rowCount: any) => {
            if (err) {
                console.error(err.message);
            }
        });
        request.on("row", (columns: any[]) => {
            let room = RoomManager.getRoom(_roomID);
            let strMsg: string = "";
            let strName: string = "";
            let strColor: string = "";
            let nFontSize: number = -1;
            columns.forEach((column: { metadata: { colName: any; }; value: any; }) => {
                if (column.metadata.colName == "Message") {
                    strMsg = column.value;
                } else if (column.metadata.colName == "Name") {
                    strName = column.value;
                } else if (column.metadata.colName == "Color") {
                    strColor = column.value;
                } else if (column.metadata.colName == "FontSize") {
                    nFontSize = column.value;
                }
            });
            room.initSetMsg(strMsg, strName, strColor, nFontSize);
        });
        request.on("requestCompleted", (rowCount, more) => {
            this.arWait.shift();
            let room = RoomManager.getRoom(_roomID);
            console.log('_roomID = ' + _roomID, " ", room.getMessage().length);
            if (this.arWait.length != 0) this.connection.execSql(this.arWait[0]);
        });
        this.arWait.push(request);
        if (this.arWait.length == 1)
            this.connection.execSql(request)
    }
    /**
     * 
     * @param deadSN 
     * @param message 
     * @param name 
     * @param color 
     * @param fontSize 
     * @param IPAddress 
     */
    public static insertChatMessage(deadSN: number, message: string, name: string, color: string, fontSize: number, IPAddress: any): void {
        var request = new Request(`INSERT INTO [Message]
            ([ID], [Message], [Name], [CreateTime], [Color], [FontSize], [IPAddress], [DelTime], [IsDel])
            VALUES(@ID, @Message, @Name, CURRENT_TIMESTAMP, @Color, @FontSize, @IPAddress, null, 0);`,
            (err: any) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("insert success");
                }
            });
        request.addParameter('Dead_SN', TYPES.Int, deadSN);
        request.addParameter('Message', TYPES.NVarChar, message);
        request.addParameter('Name', TYPES.NVarChar, name);
        request.addParameter('Color', TYPES.NChar, color);
        request.addParameter('FontSize', TYPES.Int, fontSize);
        request.addParameter('IPAddress', TYPES.NVarChar, IPAddress);
        this.connection.execSql(request);
    }
}