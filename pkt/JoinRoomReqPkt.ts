import PktModel from "./PktModel";

export default class JoinRoomReqPkt extends PktModel {
    constructor() {
        super();
    }
    public roomID: number;
}