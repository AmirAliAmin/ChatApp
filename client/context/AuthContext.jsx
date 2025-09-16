import { createContext, useState,useEffect } from "react";
import axios from "axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [token , setToken] = useState(localStorage.getItem("token"));
    const [authUser,setAuthUser] = useState(null);
    const [onlineUsers,setonlineUsers] = useState([]);
    const [socket,setSocket] = useState(null);

    //check id user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async()=>{
        try {
           const {data} = await axios.get('/api/auth/check')
           if (data.success) {
            setAuthUser(data.user)
            connectSocket(data.user)
           }
        } catch (error) {
            toast.error(error.message)   
        }
    }

    //login  function to handle user  authentication and socket connection
    const login = async (state, credentials) => {
        try {
            const {data} = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token",data.token);
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    }

    //logout the function to handle user logout and socket discoonected
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setonlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out Successfully")
        socket?.disconnect();   
    }

    //update profile function to handle user profile
    const updateProfile = async (body) => {
        try {
            const {data} = await axios.put("/api/auth/update-profile", body)
        if (data.success) {
            setAuthUser(data.user);
            toast.success("Profile updated Successfully")
             return { success: true, user: data.user };
        }else{
             toast.error(data.message || "Failed to update profile");
      return { success: false };
        }
        } catch (error) {
              toast.error(error.response?.data?.message || error.message);
    return { success: false };
        }
    }

    //connect socket function handle socket connection and online user updates
    const connectSocket = (userData)=>{ 
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl,{
            query:{
                userId:userData._id
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on("getonlineUserss" ,(userIds)=>{
            setonlineUsers(userIds)

        })

    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    }, [])

    const value ={
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile

    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}