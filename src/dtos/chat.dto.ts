import Message from "./message.dto";
import User from "./user.dto";

export default interface Chat {
    id: number,
    users?: User[],
    messages?: Message[]
}