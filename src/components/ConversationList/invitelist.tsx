import { useContext, useState } from "react";
import { ConversationContext } from "../../context/ConversationContext";
import Avatar from "../Avatar";
import { ConversationListData } from "../../types/Conversation";
import SendInvitePage from "../Invites/sendinvite";

interface ConversationListProps {
  isFirstConversation?: boolean;
  data: ConversationListData;
  isSent:boolean;
}

export default function inviteList(props: ConversationListProps) {
  const { isFirstConversation, data ,isSent} = props;
  const { setConversation } = useContext(ConversationContext);
  const { contactName, lastMessage, lastTime, image } = data;
  const borderHeight = isFirstConversation ? "0px" : "1px";
  const [isHover, seHover] = useState(false);

  return (
    <div
      className="flex items-center w-full h-[4.5rem] bg-[#111B21] pl-3 pr-4 hover:bg-[#2A3942] cursor-pointer"
      onMouseMove={() => seHover(true)}
      onMouseLeave={() => seHover(false)}
      onClick={() => setConversation(data)}
    >
      <div className="flex w-[4.8rem]">
        <Avatar width="w-12" height="h-12" image={image} />
      </div>
      <div className="flex flex-col w-full">
        <hr
          style={{ borderTop: `${borderHeight} solid rgba(134,150,160,0.15)` }}
        />
        <div className="flex py-2">
          <div className="flex flex-col w-full h-full ">
            <span className="overflow-y-hidden text-ellipsis text-white text-base">
              {contactName}
            </span>
            <span className="overflow-y-hidden text-ellipsis text-[#aebac1] text-sm">
              {lastMessage}
            </span>
          </div>
          {!isSent && <button className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg mr-2 hover:bg-green-500">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="">Accept</span>
          </button>}
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-red-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
