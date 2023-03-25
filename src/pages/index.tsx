import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    userAuthorized().then((auth) => {
      if (auth) {
        setIsLoggedIn(true)
        router.push('/home')
      } else {
        router.push('/login');
      }
    })
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh', // Set the height of the container
        }}
      >
        <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
          <CircularProgress color="secondary" />
          <CircularProgress color="success" />
          <CircularProgress color="inherit" />
          <CircularProgress color="success" />
          <CircularProgress color="secondary" />
        </Stack>
      </div>

    </>
  );
}


async function userAuthorized() {
  console.log("check")
  const token = sessionStorage.getItem('token');
  if (!token) return false;
  const response = await fetch(
    'http://localhost:8080/api/ping',
    {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + token,
      }
    }
  );
  if (response.ok) {
    return true;
  }
  return false;
}


// import { useContext, useState, useEffect } from "react";
// import ConversationDetails from "../components/ConversationDetails";
// import SideBar from "../components/SideBar";
// import { ConversationContext } from "../context/ConversationContext";
// import SendInvitePage from "../components/Invites/sendinvite";
// import InvitesPage from "../components/Invites/allinvites";
// import IconHome from "../components/Home";
// import LoginScreen from "../components/auth/login";
// import SignUp from "../components/auth/signup";
// export default function Home() {
//   const { conversation } = useContext(ConversationContext);
//   const [sendinvite, setsendinvite] = useState(false);
//   const [homechat, sethomechat] = useState(true);
//   const [seeallinvites, setseeallinvites] = useState(false);
//   const [login, setlogin] = useState(false);

//   // if(sendinvite) {
//   //   console.log("sendinvite",sendinvite);
//   //   console.log("seeallinvites",seeallinvites);
//   // }
//   // if(seeallinvites) {
//   //   console.log("seeallinvites",seeallinvites);
//   //   console.log("sendinvite",sendinvite);
//   // }

//   // if(conversation.contactName) {
//   //   console.log("conversation.contactName",conversation.contactName);
//   //   console.log("seeallinvites",seeallinvites);
//   //   console.log("sendinvite",sendinvite);
//   // }
//   useEffect(() => {
//     if (sendinvite) {
//       sethomechat(false);
//     }
//   }, [sendinvite]);

//   useEffect(() => {
//     if (seeallinvites) {
//       sethomechat(false);
//     }
//   }, [seeallinvites]);

//   useEffect(() => {
//     if (conversation.contactName) {
//       sethomechat(true);
//       setseeallinvites(false);
//       setsendinvite(false);
//     }
//   }, [conversation.contactName]);

//   return (
//     <>
//       <button onClick={() => setlogin(!login)}>Login</button>

//       {login && <SignUp />}

//       {!login && (
//         <div className="flex justify-center" id="Home">
//           <div className="flex w-full xl:container h-screen xl:py-4">
//             <SideBar
//               setsendinvite={setsendinvite}
//               setseeallinvites={setseeallinvites}
//             />
//             <div className="flex w-[70%] bg-[#222E35]">
//               {homechat && conversation.contactName ? (
//                 <ConversationDetails />
//               ) : (
//                 homechat && <IconHome />
//               )}
//               {sendinvite && <SendInvitePage />}
//               {seeallinvites && <InvitesPage />}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
