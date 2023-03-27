import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { ConversationContext } from "../../context/ConversationContext";
import Avatar from "@mui/material/Avatar";
import MessageBalloon from "../MessageBalloon";
import SendInvitePage from "../Invites/sendinvite";
import Chat from "./Chat";
import { ToastContainer, toast } from "react-toastify";

import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export default function ConversationDetails(
  {
    showChat,
    incomingCall,
    outgoingCall,
    ongoingCall,
    setOutgoingCall,
    setOngoingCall,
    setIncomingCall,
    setShowChat,
    setNumberPrompt,
    setStompClient,
    stompClient,
  }
) {
  const [messageSend, setMessageSend] = useState("");
  const [convos, setConvos] = useState([]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [subscription, setSubscription] = useState(null);
  const [friendKey, setFriendKey] = useState<CryptoKey | null>(null);

  const token = sessionStorage.getItem("token");
  const userEmail = sessionStorage.getItem("userEmail");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    setConvos([]);
    const fetchUserDetails = async () => {
      // console.log("does it come here");
      const userData = await fetch(
        `http://localhost:8080/api/user/info/${showChat}`,
        { headers }
      );
      const partnerData = await userData.json();
      setContactName(partnerData.name);
      setAvatarUrl(partnerData.avatarUrl);
      setContactEmail(partnerData.email);
    }
    const fetchConversationDetails = async () => {
      const email = showChat;

      // console.log("does it come here");
      const userData = await fetch(
        `http://localhost:8080/api/user/info/${email}`,
        { headers }
      );
      const partnerData = await userData.json();
      setContactName(partnerData.name);
      setAvatarUrl(partnerData.avatarUrl);
      setContactEmail(partnerData.email);
      const url = `http://localhost:8080/api/message/${email}/block-count`;

      // console.log("does it come here2");
      try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = parseInt(await response.text());

        // Fetch messages in reverse order of blocks
        // console.log("Number of blocks : " + data);

        const messages = [];
        for (let i = 1; i <= data; i++) {
          const blockUrl = `http://localhost:8080/api/message/${showChat}/block/${i}`;
          //  console.log(blockUrl);
          const blockResponse1 = await fetch(blockUrl, { headers });
          //  console.log(blockResponse1.body);

          const blockResponse = await blockResponse1.json();

          const parsedMessage = JSON.parse(JSON.stringify(blockResponse));
          if (!blockResponse1.ok) {
            throw new Error(`HTTP error! avi: ${blockResponse1.status}`);
          }
          // console.log("does it come here45");
          const blockData = JSON.parse(
            JSON.stringify(parsedMessage.messageList)
          );

          // console.log("parsedmessage=" + JSON.stringify(blockData));
          // console.log("here it is");
          // console.log(blockData);
          blockData.forEach((messageData) => {
            // const jsonObject = JSON.parse(messageData.content);

            // console.log("jsonObject=" + jsonObject.content.message);

            if (messageData.content != "") {
              messages.push({
                me: messageData.author === userEmail ? 1 : 0,
                author: messageData.author,
                message: messageData.content,
                date: new Date(messageData.date),
              });
            }
          });

        }



        setConvos([...messages]);
      } catch (error) {
        // console.error(error);
      }
    }
    if (ongoingCall) {
      fetchUserDetails();
    } else {
      fetchConversationDetails();
    }
  }, [showChat]);

  const [message, setMessage] = useState([]);


  function handleMessage(frame) {
    const process = async () => {
      const message = JSON.parse(frame.body as string)
      // console.log("Received" + message)
      console.log("TYPE : " + message.messagetype)
      const mt = message.messagetype as string
      if (mt == 'MESSAGE') {
        const messageText = message.content;
        const author = message.author;
        const messageDate = new Date();
        //const dt = new Date(parsedContent.content.date);

        if (messageText != "") {
          const teste = {
            me: false,
            author: author,
            message: messageText,
            date: messageDate,
          };
          setConvos((convos) => convos.concat(teste));
        }
      } else if (mt == 'CALL_REQUEST') {

        setIncomingCall(true);

      } else if (mt == 'CALL_REQUEST_ACCEPTED') {

        setOngoingCall(true);
        setIncomingCall(false);
        setOutgoingCall(false);
        // console.log(message.acceptedBy.email);
        setShowChat(message.acceptedBy.email);
        setNumberPrompt(true);
        sessionStorage.setItem('currentChat', message.acceptedBy.email);

      } else if (mt == 'CALL_REQUEST_REJECTED') {

        setOutgoingCall(false);

      } else if (mt == 'END_OF_CALL') {
        setOutgoingCall(false);
        setIncomingCall(false);
        setOngoingCall(false);
      } else if (mt == 'SECRET') {
        const cnt = message.content as string;
        if (cnt.length > 1000) {
          const secretNumber = parseInt(sessionStorage.getItem('secret-number') as string);
          console.log('secret number : ' + secretNumber);
          setFriendKey(await decipherKey(cnt, secretNumber));
        } else {
          console.log('message:' + cnt);

          const data = await decryptMessage(cnt);
          const author = message.author;
          const date = new Date;
          const teste = {
            me: false,
            author: author,
            message: data,
            date: date,
          };
          setConvos((convos) => convos.concat(teste));
        }
      }
    }
    process();
  }
  useEffect(() => {
    if (!stompClient) {
      const sock = new SockJS("http://localhost:8080/api/ws?token=" + token);
      const stomp = Stomp.over(sock);

      stomp.connect({}, () => {
        // console.log("Connected to WebSocket");
        stomp.subscribe(`/messages/${userEmail}`, handleMessage);
      });
      setStompClient(stomp);
    }
    return () => {
      // stomp.disconnect();
    };
  }, [userEmail, stompClient, setStompClient]);

  function changeHandler(evt: KeyboardEvent<HTMLInputElement>) {
    const { key } = evt;

    const process = async (key) => {
      if (key === "Enter" && messageSend != "") {
        // console.log("entered message:" + messageSend);
        const teste = {
          me: true,
          author: userEmail,
          message: messageSend,
          date: new Date(),
        };
        setConvos((convos) => convos.concat(teste));
        if (ongoingCall) {
          const data = await encryptData(friendKey, messageSend);
          console.log(data);
          stompClient.send(
            `/ms/secure`,
            {},
            data
          );
        } else {
          stompClient.send(
            `/ms/send/${showChat}`,
            {},
            messageSend
          );
        }

        setMessageSend("");
      }
    }
    process(key)
  }


  function handleLockClick() {
    // console.log('Send call request to : ' + contactEmail);
    const startCall = async () => {
      const response = await fetch(
        `http://localhost:8080/api/stego/request/call/${contactEmail}`,
        {
          method: 'get',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      );
      if (response.ok) {
        toast.success(`calling ${contactName}`, {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setOutgoingCall(true);
        // console.log('success');
      } else {
        // console.log('user offline');
        toast.error(`${contactName} is not available`);
      }
    }
    const endCall = async () => {
      const response = await fetch(
        `http://localhost:8080/api/stego/call/end`,
        {
          method: 'post',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      );
      setOngoingCall(false);
      setOutgoingCall(false);
    }
    if (ongoingCall) {
      endCall();
    } else {
      startCall();
    }
  }

  return (
    <>
      <ToastContainer></ToastContainer>

      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full px-4">
          <div className="flex justify-between bg-[#202c33] w-full h-14">
            <div className="flex items-center gap-4 h-full">
              <Avatar src={avatarUrl} />
              <h1 className="text-white font-normal">{contactName}</h1>
              <h5>{contactEmail}</h5>
            </div>
            <button onClick={handleLockClick} className="px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-black ">
              {ongoingCall ? "UNLOCK" : "LOCK"}
            </button>
            <div className="flex items-center text-[#8696a0] gap-2">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="cursor-pointer"
              >
                <path
                  fill="currentColor"
                  d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"
                ></path>
              </svg>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="cursor-pointer"
              >
                <path
                  fill="currentColor"
                  d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col w-full h-full px-24 py-6 overflow-y-auto"
        /* style={{ backgroundImage: "url('/assets/images/background.jpg')" }}*/
        >
          {convos.map((conv, index) => {

            const { me, message, date } = conv;
            // console.log("date=" + date);

            if (message != "")
              return <MessageBalloon key={index} me={me} message={message} date={date} />;
          })}
        </div>

        <footer className="flex items-center bg-[#202c33] w-full h-16 py-3 text-[#8696a0]">
          <div className="flex py-1 pl-5 gap-3">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="cursor-pointer"
            >
              <path
                fill="currentColor"
                d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
              ></path>
            </svg>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="cursor-pointer"
            >
              <path
                fill="currentColor"
                d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
              ></path>
            </svg>
          </div>
          <div className="flex w-[85%] h-12 ml-3">
            <input
              type={"text"}
              className="bg-[#2a3942] rounded-lg w-full px-3 py-3 text-white"
              placeholder="Start typing.. "
              onKeyDown={(evt) => changeHandler(evt)}
              onChange={(evt) => setMessageSend(evt.target.value)}
              value={messageSend}
            />
          </div>
          <div className="flex justify-center items-center w-[5%] h-12">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="cursor-pointer"
            >
              <path
                fill="currentColor"
                d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"
              ></path>
            </svg>
          </div>
        </footer>
      </div>
    </>
  );
}


async function decipherKey(hostData, secretNumber) {
  const pem = formatAsPem(decipher(hostData, secretNumber));
  console.log("DECIPHER KEY : " + pem);
  const key = await importPublicKey(pem);
  return key;
}

async function importPublicKey(pem) {
  // fetch the part of the PEM string between header and footer
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length
  );
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);

  // console.log(binaryDerString);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return await window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

async function decryptMessage(message) {
  const content = sessionStorage.getItem('private-key');
  const pem = formatAsPem(content);
  const key = await importPrivateKey(pem)
  return await decryptData(key, message);
}
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
// Decrypt cipher data into plaintext using private key
async function decryptData(key: CryptoKey, cipherBase64: string) {
  let binData = atob(cipherBase64);
  let dataBuffer = str2ab(binData);

  let decryptedDataBuffer = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP"
    },
    key,
    dataBuffer
  )
  return ab2str(decryptedDataBuffer);
}
function decipher(host_data, secret) {
  let current_number = operation(secret);
  let len = "";
  for (let i = 0; i < 4; i++) {
    len += host_data.charAt(current_number);
    current_number += operation(current_number);
  }
  let dataLength = parseInt(len);
  let result = new Array()

  for (let i = 0; i < dataLength; i++) {
    result.push(host_data.charAt(current_number));
    current_number += operation(current_number);
  }
  return result.join('');
}

function operation(num) {
  num += (num && ((num << 1) || num));
  num %= 17;
  num++;
  return num;
}
function formatAsPem(str) {
  var finalString = '-----BEGIN PUBLIC KEY-----\n';

  while (str.length > 0) {
    finalString += str.substring(0, 64) + '\n';
    str = str.substring(64);
  }

  finalString = finalString + "-----END PUBLIC KEY-----";
  const keyPem = finalString;
  return finalString;
}


// Encrypt text using public key object
async function encryptData(key, data64) {
  let dataArrayBuffer = str2ab(data64)
  let encryptedDataBuffer = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    key,
    dataArrayBuffer
  );
  return btoa(ab2str(encryptedDataBuffer))
}

async function importPrivateKey(pem) {
  // fetch the part of the PEM string between header and footer
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length
  );
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);

  // console.log(binaryDerString);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return await window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true,
    ['decrypt']
  );
}