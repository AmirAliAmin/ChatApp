import React, { useState } from "react";
import assets from "../assets/assets";

export default function LoginPage() {
  const [curState, setCurState] = useState("Sign Up")
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const onSubmitHandle = (event)=>{
    event.preventDefault();
    if (curState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
      
    }
  }

  return (
    <div className=" backdrop-blur-xl w-full h-screen sm:px-[15%] sm:py-[5%] text-white">
      <div
        className={`border border-gray-600 rounded-2xl overflow-hidden mx-auto w-[100%] sm:w-[50%] h-[100%] grid grid-cols relative`}
      >
        <form onClick={onSubmitHandle} action="" className="m-5 text-white p-6 flex flex-col gap-6 shadow-lg">
          <h1 className="font-medium text-2xl flex justify-between items-center">
            {curState}
            {
              isDataSubmitted && 
                <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />
            }
            
          </h1>
          {
            curState === "Sign Up" && !isDataSubmitted &&(

              <input 
              type="text" 
              value={fullName}
              onChange={(e)=>setFullName(e.target.value)}
              className="p-2 border border-gray-500 rounded-md focus:outline-none" 
              placeholder="Full Name" 
              required />
            )
          }
          {
            !isDataSubmitted && (
              <div>
                <input
                 type="email" 
                placeholder="Email Address"
                value={email}
                 required 
                 onChange={(e)=>setEmail(e.target.value)}
                 className="p-2 w-full border border-gray-500 rounded-md focus:outline-none  focus:ring-indigo-500 mb-7" />
                   <input
                 type="password" 
                 value={password}
                placeholder="Password"
                 required 
                 onChange={(e)=>setPassword(e.target.value)}
                 className="p-2 w-full border border-gray-500 rounded-md focus:outline-none  focus:ring-indigo-500" />
              </div>
            )}
            {
              curState === "Sign Up" &&  isDataSubmitted && (
                <textarea 
                onChange={(e)=>setBio(e.target.value)}
                value={bio} rows={4} className="p-2 w-full border border-gray-500 rounded-md focus:outline-none  focus:ring-indigo-500" placeholder="Bio....." required >
                </textarea>
              )
            }
            <button type="submit" className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
              {curState === "Sign Up" ? "Create Account" : "Login Now"}
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input type="checkbox" />
              <p>Agree to the tearm and condition</p>
            </div>

            <div className="flex flex-col gap-2">
              {
                curState === "Sign Up" ? (
                  <p className="text-sm text-gray-600">Already have an Account? <span className="font-medium text-violet-500 cursor-pointer" onClick={()=>{setCurState("Login"); setIsDataSubmitted(false)}}>Login here</span></p>
                ):(
                  <p className="text-sm text-gray-600">Create an account <span className="font-medium text-violet-500 cursor-pointer" onClick={()=>{setCurState("Sign Up")}}>Click here</span></p>
                )
              }
            </div>
        </form>
      </div>
    </div>
  );
}
