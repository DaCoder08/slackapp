import { Schema, model, Document, Model } from "mongoose";

var schema = new Schema({
    email:String,
    uname:String,
    passw:String
})

export const User = model("User", schema)