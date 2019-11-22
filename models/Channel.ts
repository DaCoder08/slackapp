import { Schema, model } from "mongoose";

var schema = new Schema({
    name:String,
    teamid:String,
    users:[String],
    private: Boolean
})

export const Channel = model("Channel", schema)