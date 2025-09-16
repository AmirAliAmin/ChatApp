import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";


export const getUserForSidebar = async (req, res) => {
    try {
        const userId  = req.user._id;
        const filteredUser = await User.find({_id:{$ne:userId}}).select("-password");

        //count number of message not seen
        const unseenMessage ={};
        const promise = filteredUser.map(async (user) => {
            const message = await Message.find({senderId: user._id, receiverId:userId, seen:false})
            if (message.length>0) {
                unseenMessage[user._id] = message.length;
            }
        })
        await Promise.all(promise);
        res.json({ success: true, users: filteredUser, unSeenMessage: unseenMessage });

    } catch (error) {
         console.log(error.message)
        res.json({success:false, message:error.message})   
    }
}

export const getMessage = async (req, res) => {
    try {
        const {id:selectedUserId} = req.params;
    const myId = req.user._id;

    const message = await Message.find({
        $or:[
            {senderId:myId, receiverId:selectedUserId},
            {senderId:selectedUserId, receiverId:myId},
        ]
    })
    await Message.updateMany({senderId:selectedUserId, receiverId:myId}, {seen:true})
     res.json({success:true, message})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, message:error.message})   
    }
}

export const markMessageAsSeen = async (req, res) => {
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen:true})
        res.json({success:true})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message}) 
    }
    
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imgUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imgUrl
        })

        //Emit the new message to the receiver socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
            
        }


        res.json({success:true, newMessage})
        
    } catch (error) {
         console.log(error.message)
        res.json({success:false, message:error.message}) 
    }
    
}