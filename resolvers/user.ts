import { User } from "../models/User";
import * as bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export default {
    register:(_:any, {uname, email, passw}) => {
        var newUser = new User({
            uname,
            email,
            passw
        })
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(newUser.passw, salt);

        newUser.passw = hash

        newUser.save()

        return true
    },
    login: async (_:any, {uname, passw}, { req, res }) => {
        var user = await User.findOne({uname});
        if(!user){
            return null;
        }
        else{
            if(bcrypt.compareSync(passw, user.passw)){
                var token = sign({id:user._id, uname:user.uname}, 'my_secret');
                return ({
                    token,
                    uname:uname,
                    email:user.email,
                    id:user._id
                })
            }else{
                return null;
            }
        }
    }
    
}