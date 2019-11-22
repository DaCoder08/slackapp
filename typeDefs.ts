import { gql } from "apollo-server-core";

export default gql`
    type Query{
        hello: String
        getTeams:[Team]
        getChannels(teamid: String): [Channel]
        getMessages(channelid: String): [Message]
        me: String
    }
    type Team{
        id:ID
        name:String
        owner:String
        channels:[Channel]
    }
    type Channel{
        id:ID
        name:String
        teamid:ID
        users:[String]
        messages: [Message]
    }
    type User{
        uname:String
        email:String
        id: ID
        token: String
    }
    type Message{
        id: ID
        text: String
        channelid: ID
        userid: String
        uname: String
    }
    type Mutation{
        createUser(uname:String, email:String, passw:String):Boolean
        login(uname:String, passw:String):User
        createTeam(name: String):Team
        joinTeam(teamid:String):Boolean
        createPrivateChannel(teamid:String, name:String, users:[String]):Boolean
        createPublicChannel(teamid:String, name:String):Boolean
        createMessage(text:String, channelid:String): Boolean
        inviteToTeam(unames:[String], teamid:String): Boolean
        inviteToChannel(users:[String], channelid:String): Boolean
    }
    type Subscription{
        newMessage(channelid:String):Message
    }
`