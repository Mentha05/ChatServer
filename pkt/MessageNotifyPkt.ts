import Message from "../model/Message";
import PktModel from "./PktModel";

export default class MessageNotifyPkt extends PktModel {
    constructor() {
        super();
    }
    public messageData: Message;
}