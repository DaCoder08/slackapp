import { decode } from "jsonwebtoken";

export function authChecher(req){
    console.log(req)
    console.log(req.headers.cookie.split("=")[1], "my_secret")
    try{
        if(decode(req.headers.cookie.split("=")[1], "my_secret") === null){
            console.log(decode(req.headers.cookie.split("=")[1], "my_secret"))
            return false;
        }
    }catch(e){
        console.log(e)
        return false
    }
    console.log("hi")
    return true
}