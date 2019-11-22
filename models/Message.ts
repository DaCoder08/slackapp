import { Schema, model } from "mongoose";

var schema = new Schema({
    text:String,
    userid:String,
    channelid:String
})

export const Message = model("Message", schema)