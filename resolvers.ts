import user from "./resolvers/user";
import team from "./resolvers/team";
import channel from "./resolvers/channel";
import message from "./resolvers/message";

const NEW_MESSAGE = 'NEW_MESSAGE'

export default {
    Query:{
       hello: () => {
           return "Hello World"
       },
       me: (_, __, { req }) => {
           if(!req.user){
               return "Not Authenticated";
           }
           return req.user.uname
       },
       getTeams: team.getAll,
       getChannels: channel.getAll,
       getMessages: message.getByChannel
       
    },
    Mutation:{
        createUser: user.register,
        login: user.login,
        createTeam: team.create,
        joinTeam: team.join,
        createPrivateChannel: channel.createPrivate,
        createPublicChannel: channel.createPublic,
        createMessage: message.add,
        inviteToTeam: team.inviteTo,
        inviteToChannel: channel.inviteTo
    },
    Team:{
        channels: async (parent, _, __) => {
            return channel.getAll({}, { teamid :parent.id }, __)
        }
    },
    Subscription:{
        newMessage:{
            subscribe: (_, { channelid }, { pubsub }) => {
                return pubsub.asyncIterator(`${NEW_MESSAGE}_${channelid}`)
            }
            
        }
    }
}