import { Key, KeyboardEvent, useContext, useEffect, useState } from "react";
import { ConversationContext } from "../../context/ConversationContext";
import Avatar from "@mui/material/Avatar";
import MessageBalloon from "../MessageBalloon";
import SendInvitePage from "../Invites/sendinvite";

export default function Chat({ 
    avatarUrl,
    ContactName,
    contactEmail,
    convos}) {
 
  return (
    <>
   
      <div className="flex justify-between w-full px-4">
        
        <div className="flex justify-between bg-[#202c33] w-full h-14">
          
          <div className="flex items-center gap-4 h-full">
            <Avatar src={avatarUrl} />
            <h1 className="text-white font-normal">{ContactName}</h1>
            <h5>{contactEmail}</h5>
            <button>lock</button>
          </div>
          
          <div className="flex items-center text-[#8696a0] gap-2">
            <svg viewBox="0 0 24 24" width="24" height="24" className="cursor-pointer">
              <path fill="currentColor" d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z">
              </path>
            </svg>
            <svg viewBox="0 0 24 24" width="24" height="24" className="cursor-pointer">
              <path fill="currentColor" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path>
            </svg>
          </div>
          
        </div>
      </div>
      
      <div className="flex flex-col w-full h-full px-24 py-6 overflow-y-auto" style={{ backgroundImage: "url('/assets/images/background.jpg')" }}>
        {

        convos.map( ( conv: { me: any; message: any; }, index: Key | null | undefined ) => {
          const { me, message } = conv;

          return (
            <MessageBalloon key={index} me={me} message={message} />
          )
        } )

         
        }
      </div> 
      </>
      
   
  )
}