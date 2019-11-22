import { Schema, model } from "mongoose";

var schema = new Schema({
    name:String,
    owner:String
})

export const Team = model("Team", schema)