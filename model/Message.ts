export default class Message {
    constructor(_msg: string, _name: string, _color: string, _fontSize: number, _time: number, _sender?: string) {

        this.msg = _msg;
        this.name = _name;
        this.color = _color;
        this.fontSize = _fontSize;
        this.time = _time;
        this.sender = _sender;
    }
    public msg: string;
    public name: string;
    public color: string;
    public fontSize: number;
    public time: number;
    public sender: string;
}
