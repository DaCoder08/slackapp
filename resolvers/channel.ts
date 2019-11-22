import { Team } from "../models/Team";
import { User } from "../models/User";
import { Member } from "../models/Member";
import { Channel } from "../models/Channel";

export default {
    createPrivate: async (_, args, { req }) => {
        if(!req.user){
            throw new Error("Not Authenticated")
        }
        var team = await Team.findById(args.teamid)

        if(!team){
            return false;
        }

        var users = [...args.users, req.user.uname];

        for (const key in users) {
            if(!(await User.findOne({uname:users[key]}))){
                return false;
            }else{
                if(!(await Member.findOne({
                    teamid:args.teamid,
                    userid:(await User.findOne({uname:users[key]}))._id
                }))){
                    return false;
                }else{
                    continue;
                }
            }
       
        }

        var newChannel = new Channel({
            name:args.name,
            teamid:args.teamid,
            users: users,
            private: true
        })

        newChannel.save()

        return true

    },
    createPublic: async (_:any, { name, teamid }, { req }) => {
        if(!req.user){
            throw new Error("Not Authenticated")
        }
        var team = await Team.findById(teamid)

        if(!team){
            return false;
        }

        var newChannel = new Channel({
            name: name,
            teamid: teamid,
            private: false
        })

        newChannel.save()

        return true
    },
    getAll:async (_:any, { teamid }, { req }) => {

        if(!req.user){
            throw new Error("Not Authenticated")
        }
        var team = await Team.findById(teamid)

        if(!team){
            return null;
        }

        var channels = await Channel.find({ users:{ $in: [req.user.uname] }, teamid })

        var publicChannels = await Channel.find({ private:false, teamid })

        var allChannels = publicChannels.concat(channels);

        return allChannels;
    },
    inviteTo: async (_, { channelid, users }, { req }) => {
        if(!req.user){
            throw new Error("Not Authenticated")
        }

        var channel;

        console.log(users)

        try{
            channel = await Channel.findById(channelid, function (err, doc){
                doc.users = [...doc.users, ...users];
                doc.save()
            })


        }catch(e){
            return false
        }

        return true
    }
    
}