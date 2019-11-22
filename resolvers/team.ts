import { Team } from "../models/Team";
import { Member } from "../models/Member"
import { Channel } from "../models/Channel"
import { User } from "../models/User"


export default {
    create: (_, { name }, { req }) => {
       if(!req.user){
           throw new Error("Not Authenticated")
       }
       const team = new Team({
           owner: req.user.uname,
           name: name
       })
       team.save()

       const member = new Member({
           userid: req.user.id,
           teamid:team.id
       })

       const general = new Channel({
           name: "general",
           teamid: team.id,
           private: false
       })

       general.save()

       member.save()

       return team;
    },
    join: async (_, { teamid }, { req }) => {
        if(!req.user){
           throw new Error("Not Authenticated")
        }
        var team;
        try{
            team = await Team.findById(teamid)
        }catch(e){
            console.log(e)
            return false
        }
        new Member({
            userid: req.user.id,
            teamid: team.id
        }).save()

        return true;
    },
    getAll: async (_, __, { req }) => {
        if(!req.user){
            throw new Error("Not Authenticated")
        }
        var teams = []
        var members = await Member.find({ userid: req.user._id })

        if(!members){
            return null
        }

        for(var i in members){
            var team = await Team.findById(members[i].teamid)

            teams.push(team)
        }

        return (teams)
    },

    inviteTo: async (_, { unames, teamid }, { req }) => {
        if(!req.user){
           throw new Error("Not Authenticated")
        }
        var team;
        try{
            team = await Team.findById(teamid)
        }catch(e){
            return false
        }


        if(team.owner !== req.user.uname) return false

        let fail = false;

        for (const uname of unames) {
            let user = await User.findOne({ uname });
            if(!user){
                fail = true
                break
            }
            new Member({
                userid: user.id,
                teamid: team.id
            }).save()
        }
        return !fail
    }
    
    
}