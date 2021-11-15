import PktModel from "./PktModel";

export default class MessageReqPkt extends PktModel {
    constructor() {
        super();
    }
    public Msg: string;
    public Name: string;
    public Color: string;
    public FontSize: number;
}