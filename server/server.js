import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http, { createServer } from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routers/userRouter.js';
import messageRouter from './routers/messageRouter.js';
import { Server } from 'socket.io';

// Create Express App and HTTP server
const app = express();
const server = createServer(app)

//Initialize socket.io server
export const io = new Server(server,{
    cors: {origin:"*"}
})

//store online users
export const userSocketMap = {};// {userId:socketId}

//socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("user Connected", userId);
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", ()=>{
         console.log("user Disconnect", userId);
         delete userSocketMap[userId];
         io.emit("getOnlineUsers", Object.keys(userSocketMap))

    })

})


//Middleware setup
app.use(express.json({limit:"4mb"}))
app.use(cors());

app.use("/api/status", (req,res)=>res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/message", messageRouter);

//connect DB
await connectDB()

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log("Server is running on PORT", PORT));