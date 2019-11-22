import { Channel } from "../models/Channel";
import { Message } from "../models/Message";
import { User } from "../models/User";

const NEW_MESSAGE = 'NEW_MESSAGE';
export default {
    add: async (
        _:any,
        {channelid, text},
        { req, pubsub }
    ) => {
        if(!req.user){
            return false
        }
        var channel = Channel.findById(channelid)

        if(!channel){
            return false;
        }

        const newMessage = new Message({
            text,
            userid:req.user.id,
            channelid
        });

        var uname = (await User.findById(newMessage.userid)).uname

        newMessage.uname = uname

        pubsub.publish(`${NEW_MESSAGE}_${channelid}`, { newMessage })

        newMessage.save()

        return true

    },

    getByChannel: async (
        _:any,
        {channelid},
        { req }
    ) => {
        if(!req.user){
            return false
        }
        var channel = Channel.findById(channelid)

        if(!channel){
            return false;
        }
        
        try{
            var msgs = await Message.find({
                channelid
            })

            var msgs2 = []

            for (const msg of msgs) {
                var user = await User.findById(msg["userid"])

                var uname = user.uname;

                msg.uname = uname

                msgs2.push(msg)
            }

            return msgs2
        }
        catch(e){
            
            return null
        }
    }
    
    
}