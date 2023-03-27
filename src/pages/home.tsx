import { useContext, useEffect, useState } from "react";
import { ConversationContext } from "../context/ConversationContext";
import ConversationDetails from "../components/ConversationDetails";
import IconHome from "../components/Home";
import InvitesPage from "../components/Invites/allinvites";
import SendInvitePage from "../components/Invites/sendinvite";
import SideBar from "../components/SideBar";
import IncomingCall from "../components/Call/incomingCall";
import OutgoingCall from "../components/Call/outgoingCall";
import NumberPrompt from "../components/Call/numberPrompt";

function HomeContent() {
  const { conversation } = useContext(ConversationContext);
  const [sendinvite, setsendinvite] = useState(false);
  const [homechat, sethomechat] = useState(true);
  const [seeallinvites, setseeallinvites] = useState(false);
  const [showChat, setShowChat] = useState("");
  const [incomingCall, setIncomingCall] = useState(false);
  const [outgoingCall, setOutgoingCall] = useState(false);
  const [ongoingCall, setOngoingCall] = useState(false);
  const [numberPrompt, setNumberPrompt] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (sendinvite) {
      sethomechat(false);
      setseeallinvites(false);
    }
  }, [sendinvite]);

  useEffect(() => {
    if (seeallinvites) {
      sethomechat(false);
      setsendinvite(false);
    }
  }, [seeallinvites]);

  useEffect(() => {
    console.log("showChatinHome" + showChat);
    if (showChat) {
      sethomechat(true);
      setseeallinvites(false);
      setsendinvite(false);
    }
  }, [showChat]);

  return (
    <div className="flex justify-center" id="Home">

      <div className="flex w-full xl:container h-screen xl:py-4">
        <SideBar
          setsendinvite={setsendinvite}
          setseeallinvites={setseeallinvites}
          setShowChat={setShowChat}
          ongoingCall={ongoingCall}
        />

        <div className="flex w-[70%] bg-[#222E35]">
          {
            incomingCall &&
            <IncomingCall
              setIncomingCall={setIncomingCall}
              setOngoingCall={setOngoingCall}
              setShowChat={setShowChat}
              setNumberPrompt={setNumberPrompt}
            />
          }
          {
            outgoingCall && <OutgoingCall setOutgoingCall={setOutgoingCall} />
          }
          {
            numberPrompt && <NumberPrompt
              setNumberPrompt={setNumberPrompt}
              stompClient={stompClient}
            />
          }
          {/* for floating options, incoming call,  */}
          {/* <div className="flex justify-center items-center v-screen ">
            <div className="bg-white p-8 rounded-lg shadow-lg float-right mx-auto">
              <button>Hello</button>
            </div>
          </div> */}
          {homechat && showChat ? (
            <ConversationDetails
              showChat={showChat}
              setIncomingCall={setIncomingCall}
              setOutgoingCall={setOutgoingCall}
              setOngoingCall={setOngoingCall}
              incomingCall={incomingCall}
              outgoingCall={outgoingCall}
              ongoingCall={ongoingCall}
              setShowChat={setShowChat}
              setNumberPrompt={setNumberPrompt}
              stompClient={stompClient}
              setStompClient={setStompClient}
            />
          ) : (
            homechat && <IconHome />
          )}
          {sendinvite && <SendInvitePage />}
          {seeallinvites && <InvitesPage />}
        </div>
      </div>
    </div>
  );
}

export default HomeContent;
