import PktModel from "./PktModel";
import Message from "../model/Message";

export default class JoinRoomRespPkt extends PktModel {
    constructor() {
        super();
    }
    public Ret: number;
    public messageData: Message[];
}