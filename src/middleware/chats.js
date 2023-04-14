import { useState, useEffect } from 'react';

const useFetchConversationDetails = (showChat, headers, userEmail, ongoingCall) => {
  const [convos, setConvos] = useState([]);
  const [contactName, setContactName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    setConvos([]);
    const fetchUserDetails = async () => {
      const userData = await fetch(
        `http://localhost:8080/api/user/info/${showChat}`,
        { headers }
      );
      const partnerData = await userData.json();
      setContactName(partnerData.name);
      setAvatarUrl(partnerData.avatarUrl);
      setContactEmail(partnerData.email);
    };
    const fetchConversationDetails = async () => {
      const email = showChat;
      const userData = await fetch(
        `http://localhost:8080/api/user/info/${email}`,
        { headers }
      );
      const partnerData = await userData.json();
      setContactName(partnerData.name);
      setAvatarUrl(partnerData.avatarUrl);
      setContactEmail(partnerData.email);
      const url = `http://localhost:8080/api/message/${email}/block-count`;
      try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = parseInt(await response.text());
        const messages = [];
        for (let i = 1; i <= data; i++) {
          const blockUrl = `http://localhost:8080/api/message/${showChat}/block/${i}`;
          const blockResponse1 = await fetch(blockUrl, { headers });
          const blockResponse = await blockResponse1.json();
          const parsedMessage = JSON.parse(JSON.stringify(blockResponse));
          if (!blockResponse1.ok) {
            throw new Error(`HTTP error! avi: ${blockResponse1.status}`);
          }
          const blockData = JSON.parse(JSON.stringify(parsedMessage.messageList));
          blockData.forEach((messageData) => {
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
        console.error(error);
      }
    };
    if (ongoingCall) {
      fetchUserDetails();
    } else {
      fetchConversationDetails();
    }
  }, [showChat]);

  return { convos, contactName, avatarUrl, contactEmail };
};

export default useFetchConversationDetails;
