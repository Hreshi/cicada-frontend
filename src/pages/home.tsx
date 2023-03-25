import { useContext, useEffect, useState } from "react";
import { ConversationContext } from "../context/ConversationContext";
import ConversationDetails from "../components/ConversationDetails";
import IconHome from "../components/Home";
import InvitesPage from "../components/Invites/allinvites";
import SendInvitePage from "../components/Invites/sendinvite";
import SideBar from "../components/SideBar";

function HomeContent() {
  const { conversation } = useContext(ConversationContext);
  const [sendinvite, setsendinvite] = useState(false);
  const [homechat, sethomechat] = useState(true);
  const [seeallinvites, setseeallinvites] = useState(false);
  const [showChat, setShowChat] = useState("");

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
        />
        <div className="flex w-[70%] bg-[#222E35]">
          {homechat && showChat ? (
            <ConversationDetails
              showChat={showChat}
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
