import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'

export default function HomePage() {
    const [selectedUser, setSelectedUser] = useState(false);
  return (
    <div className='w-full  h-screen sm:px-[15%] sm:py-[5%] text-white'>
      <div className={`backdrop-blur-xl border-2 border-gray-600 h-full rounded-2xl overflow-hidden sm:h-[500px] grid grid-cols relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr] ': 'md:grid-cols-2'}`}>
        <Sidebar/>
        <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
        <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
      </div>
    </div>
  )
}
