import { Schema, model } from "mongoose";

var schema = new Schema({
    userid:String,
    teamid:String
})

export const Member = model("Member", schema)