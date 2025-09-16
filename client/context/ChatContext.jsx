import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({children})=>{
    
    const [message, setMessage] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setselectedUser] = useState(null)
    const [unSeenMessage, setUnSeenMessage] = useState({})
    
    const {socket ,axios} =useContext(AuthContext);
    
    //function to get all user for sidebar
    const getUser = async()=>{
        try {
           const{data}= await axios.get("/api/message/users");
            if (data.success) {
                setUsers(data.users || []);
                setUnSeenMessage(data.unSeenMessage || {})
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to get message from selected user
    const getMessage = async (userId) => {
        try {
           const {data} = await axios.get(`/api/message/${userId}`);
           if (data.success) {
            setMessage(data.message)
            
           }

            
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to send message to the selected User
    const sendMessage = async (messageData) => {
        try {
            const {data} = await axios.post(`/api/message/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessage((prevMessage)=>[...prevMessage, data.newMessage])
            }else{
                toast.error(error.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    }

    //function to subscribe to message for selected user
    const subscribeToMessage = async () => {
        if (!socket) return;
        socket.on("newMessage", (newMessage)=>{
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessage((prevMessage)=>[...prevMessage, newMessage])
                axios.put(`/api/message/mark/${newMessage._id}`);
            }else{
                setUnSeenMessage((prevUnSeenMessage)=>({
                    ...prevUnSeenMessage,[newMessage.senderId] : 
                    prevUnSeenMessage[newMessage.senderId] ?
                    prevUnSeenMessage[newMessage.senderId]+1 : 1
                }))
            }
        })
    }

    //function to unsubscribe from message
    const unsubscribeFromMessage = ()=>{
        if (socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessage();
        return ()=> unsubscribeFromMessage();
    
    }, [socket, selectedUser])


    const value = {
        message,
        users,
        selectedUser,
        getUser,
        setMessage,
        sendMessage,
        setselectedUser,
        unSeenMessage,
        setUnSeenMessage

    }
    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}