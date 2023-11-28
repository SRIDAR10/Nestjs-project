import { Document } from "mongoose";


export interface IUsers extends Document{
    readonly token: String,
    readonly userId: String,
}