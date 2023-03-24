import React from "react";

import { KeyboardEvent, useContext, useEffect, useState } from "react";
import Avatar from "../Avatar";
import { ConversationContext } from "../../context/ConversationContext";
import ConversationList from "../ConversationList";
import InviteList from "../ConversationList/invitelist";
import conversations from "../../data.json";
import InviteComp from "./inviteComp";

export default function InvitesPage() {
  const [search, setSearch] = useState("");
  const [received, setrecieved] = useState(true);
  const [sent, setsent] = useState(false);
  const [invites, setInvites] = useState([]);
  const [invitesReceived, setInvitesReceived] = useState([]);

  // const conversationsList = conversations.conversation_list;
  // const filteredConversationsList =
  //   search.length > 0
  //     ? conversationsList.filter((InviteList) =>
  //         InviteList.contactName.toLowerCase().includes(search)
  //       )
  //     : conversationsList;

  //     console.log(filteredConversationsList);
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Search for username code here
  };

  const userEmail = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    async function fetchInvites() {
      const sentInvitesResponse = await fetch(
        "http://localhost:8080/api/invite/sent",
        {
          method:'get',
          headers: {
            'Authorization':'Bearer ' + sessionStorage.getItem('token')
          }
        }
      );
      const sentInvitesData1 = await sentInvitesResponse.json();
      //const sentInvitesData = JSON.stringify(sentInvitesData1);

    //  console.log("avi"+sentInvitesData1);

      const receivedInvitesResponse = await fetch(
        "http://localhost:8080/api/invite/received",
        {
          method:'get',
          headers: {
            'Authorization':'Bearer ' + sessionStorage.getItem('token')
          }
        }
      );

      const receivedInvitesData1 = await receivedInvitesResponse.json();
      //const receivedInvitesData =  JSON.stringify(receivedInvitesData1);

      // console.log(receivedInvitesData1);
      const emailsRec= new Set();

      for(const email of receivedInvitesData1){
        emailsRec.add(email.email);
      }

      const receivedUserData = await Promise.all(
        Array.from(emailsRec).map(async (email) => {
          const userResponse = await fetch(
            `http://localhost:8080/api/user/info/${email}`,
            {
              method:'get',
              headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
              }
            }
          );
          const receivedUserData = await userResponse.json();
          return {
            userEmail: receivedUserData.email,
            name: receivedUserData.name,
            issent: 0,
            avatarUrl: receivedUserData.avatarUrl,
            
          };
        })
      );


      const emails = new Set();

      for(const email of sentInvitesData1){
        emails.add(email.email);
      }
     

      
      const usersData = await Promise.all(
        Array.from(emails).map(async (email) => {
          const userResponse = await fetch(
            `http://localhost:8080/api/user/info/${email}`,
            {
              method:'get',
              headers: {
                'Authorization':'Bearer ' + sessionStorage.getItem('token') 
              }
            }
          );
          const userData = await userResponse.json();
          return {
            userEmail: userData.email,
            name: userData.name,
            issent: 1,
            avatarUrl: userData.avatarUrl,
            
          };
        })
      );

      console.log("userData:"+usersData);
      setInvites(usersData);

      console.log(receivedUserData);
      setInvitesReceived(receivedUserData);
    }

    fetchInvites();
  }, [userEmail, token]);

  function HandleClickofheadsent() {
    setrecieved(false);
    setsent(true);
  }

  function HandleClickofheadrecieved() {
    setsent(false);
    setrecieved(true);
  }
  return (
    <div className="flex flex-col w-full ">
      <div className="flex justify-between w-full px-4">
        <div className="flex justify-between bg-[#202c33] w-full h-14">
          <div className="flex items-center gap-4 h-full">
            <h1 className="text-white font-normal">
              <div className="ml-8">All Invites</div>
            </h1>
          </div>
        </div>
      </div>
      <footer className="flex items-center bg-[#202c33] w-full h-16 py-3 text-[#8696a0]">
        <div className="ml-8">
          <button
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg mr-2 hover:bg-black ${
              received ? "bg-green-500" : "bg-gray-700"
            }`}
            onClick={() => HandleClickofheadrecieved()}
          >
            Sent Requests
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-black ${
              sent ? "bg-green-500" : "bg-gray-700"
            }`}
            onClick={() => HandleClickofheadsent()}
          >
            Received Requests
          </button>
        </div>
      </footer>

      {received && (
        <div
          className="flex flex-col w-full overflow-y-scroll "
          id="conversation"
        >
          {invites.map((invite, index) => {
            const { name, userEmail, avatarUrl, issent } = invite;
            console.log("name: "+name+"email: "+userEmail+"avatarUrl: "+avatarUrl+"isSent: "+issent);
            if (issent) {
              return (
                <InviteComp
                  key={index}
                  isFirstConversation={index == 0}
                  userName={name}
                  useremail={userEmail}
                  avatarUrl={avatarUrl}
                  isSent={issent}
                />
              );
            }
          })}
        </div>
      )}

      {sent && (
        <div
          className="flex flex-col w-full overflow-y-scroll "
          id="conversation"
        >
          {invitesReceived.map((invite, index) => {
            const {name, userEmail, avatarUrl, issent } = invite;
            if (!issent) {
              return (
                <InviteComp
                key={index}
                isFirstConversation={index == 0}
                userName={name}
                useremail={userEmail}
                avatarUrl={avatarUrl}
                isSent={issent}
                />
              );
            }
          })}
        </div>
      )}

      <footer className="flex items-center bg-[#202c33] w-full h-16 py-3 text-[#8696a0]"></footer>
    </div>
  );
}
