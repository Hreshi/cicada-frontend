import { useContext, useState } from "react";
import { ConversationContext } from "../../context/ConversationContext";
import { ConversationListData } from "../../types/Conversation";
import SendInvitePage from "../Invites/sendinvite";
import Avatar from "@mui/material/Avatar";

interface ConversationListProps {
  isFirstConversation: boolean;
  myName: string;
  partnerEmail: string;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: string;

  avatarUrl: string;
  me: boolean;
  setShowChat: (value: string) => void;
}

export default function AllConversations(props: ConversationListProps) {
  const {
    isFirstConversation,
    myName,
    partnerEmail,
    partnerName,
    lastMessage,
    avatarUrl,
    me,
    setShowChat,
    ongoingCall,
  } = props;

  const borderHeight = isFirstConversation ? "0px" : "1px";
  const [isHover, seHover] = useState(false);

  const handleClickonConversation = () => {
    // if a call is going on then block
    if (ongoingCall) return;
    console.log("click on conversation" + partnerEmail);
    setShowChat(partnerEmail);

    sessionStorage.setItem("currentChat", partnerEmail);
  };

  return (
    <div
      className="flex items-center w-full h-[4.5rem] bg-[#1e1e26] pl-3 pr-4 hover:bg-[#2A3942] cursor-pointer border-b border-gray-700"
      onMouseMove={() => seHover(true)}
      onMouseLeave={() => seHover(false)}
      onClick={() => handleClickonConversation()}
    >
      <div className="flex w-[4.8rem]">
        <Avatar src={avatarUrl} />
      </div>
      <div className="flex flex-col w-full ">
        <div className="flex py-2">
          <div className="flex flex-col w-full h-full ">
            <span className="overflow-y-hidden text-ellipsis text-white text-base">
              {partnerName}.{partnerEmail}
            </span>
            <span className="overflow-y-hidden text-ellipsis text-[#aebac1] text-sm">
              {/* {me
                ? `${myName} : ${lastMessage}`
                : `${partnerName} : ${lastMessage}`} */}

              {me
                ? `${myName} :"last message by me"`
                : `${partnerName} : "last message by user"`}
            </span>{" "}
          </div>
          <div className="flex flex-col w-auto text-[#aebac1]">
            <h1 className="text-xs"></h1>
            {isHover ? (
              <span className="flex cursor-pointer h-full items-center justify-center">
                <svg viewBox="0 0 19 20" width="19" height="20" className="">
                  <path
                    fill="currentColor"
                    d="m3.8 6.7 5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z"
                  ></path>
                </svg>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
