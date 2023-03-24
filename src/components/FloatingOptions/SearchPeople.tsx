import React, { useState } from 'react';
import Link from 'next/link';
import Avatar from '../Avatar';
export default function SearchPeople ({search,setSearch}) {
    
const [notifications, setNotifications] = useState([
{ id: 1, text: "Send Invite", read: false },
{ id: 2, text: "See All Invites", read: true },

]);


return (
    <div className="absolute flex flex-col  mt-10 h-12">
        <div className="absolute right-0 z-10 w-56 bg-black rounded-md shadow-lg">
            <div className="py-2">
                
            <div className="flex items-center">
            <div className="m-2">
            <input
              className="w-[96%] h-9 rounded-lg bg-[#202c33] text-white text-sm px-10"
              placeholder="Search or start a new conversation"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
            </div>
        </div>
    </div>
);

};

