import User from "./user.dto";

interface Chat {
    id: number,
    users?: User[],
    messages?: Message[]
}