const express = require("express")
import { ApolloServer, PubSub } from 'apollo-server-express';
import typeDefs from "./typeDefs";
import resolvers from "./resolvers"
import * as mongoose from 'mongoose';
import { decode } from "jsonwebtoken";
import { User } from './models/User';
import { makeExecutableSchema } from "graphql-tools";
import { createServer } from 'http';
const path = require("path")

var cors = require("cors")

var schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

mongoose.connect("mongodb+srv://Bob:bob123@cluster0-fguxs.mongodb.net/slack", {useNewUrlParser:true})

var app = express()

app.use(cors());

app.use(express.static('build'))

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
});

var userMiddleware = async (req, res, next) => {
    var token = req.headers.token;
    if(!token){
        return next()
    }
    var decoded = decode(token)
    if(!decoded){
        return next()
    }
    var user = await User.findById(decoded.id);
    if(!user){
        return next()
    }
    req.user = user
    next()
}

app.use(userMiddleware)

var pubsub = new PubSub()

var server = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res, pubsub })
})

server.applyMiddleware({ app })

const httpServer = createServer(app)

server.installSubscriptionHandlers(httpServer)

httpServer.listen(80, () => {
    console.log("Server started at http://localhost:80/graphql")
})

