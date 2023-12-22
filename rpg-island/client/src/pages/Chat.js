// Chat.js
import ChatInput from '../Chat/ChatInput'
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Chat = () => {
  const [cookies, removeCookie] = useCookies(['user']);
  const { userId } = useParams();
  const [userData, setUser] = useState("");
  const MyUserId = cookies.UserId;
  const [usersMessages, setUsersMessages] = useState(null)
  const [clickedUsersMessages, setClickedUsersMessages] = useState(null)
  let navigate = useNavigate();


  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user', {
        params: { userId },
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);



  ///
  const getUsersMessages = async () => {
    try {
      if (MyUserId) {
        const response = await axios.get('http://localhost:8000/messages', {
          params: { userId, correspondingUserId: MyUserId },
        });
        setUsersMessages(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const getClickedUsersMessages = async () => {
    try {
      if (MyUserId) {
        const response = await axios.get('http://localhost:8000/messages', {
          params: { userId: MyUserId, correspondingUserId: userId },
        });
        setClickedUsersMessages(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

   useEffect(() => {
       getUsersMessages()
       getClickedUsersMessages()
   }, [])


  const messages = [];

  usersMessages?.forEach((message) => {
    const formattedMessage = {};
    formattedMessage['username'] = message.from_username;
    formattedMessage['message'] = message.message;
    formattedMessage['timestamp'] = message.timestamp;
  
    if (!messages.find((m) => m.timestamp === formattedMessage.timestamp)) {
      messages.push(formattedMessage);
    }
  });
  
  clickedUsersMessages?.forEach((message) => {
    const formattedMessage = {};
    formattedMessage['username'] = message.to_username;
    formattedMessage['message'] = message.message;
    formattedMessage['timestamp'] = message.timestamp;
  
    if (!messages.find((m) => m.timestamp === formattedMessage.timestamp)) {
      messages.push(formattedMessage);
    }
  });

  const descendingOrderMessages = messages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  
  const handleMyAnnoucements = () => {
    navigate('/myAnnoucements');
  };

  return (
    <div>
      <p>
        <button onClick={handleMyAnnoucements}> Powrót </button>
      </p>

      {userData ? (
        <>
          <h2>Chat z użytkownikiem {userData.first_name} {userData.second_name}</h2>
          <p>Imię: {userData.first_name}</p>
          <p>Nazwisko: {userData.second_name}</p>
          <p>Wiek: {userData.age}</p>
          <p>O mnie: {userData.about}</p>
          <p>Płeć: {userData.gender_identity}</p>

        </>
      ) : (
        <p>Ładowanie danych...</p>
      )}
<div>
  <>
<p>CHAT!</p>
            <div className="chat-display">
                {descendingOrderMessages.map((message, _index) => (
                    <div key={_index}>
                            <h4>{message.username}</h4>

                        <p>{message.message}</p>
                        
                    </div>
                ))}
            </div>

<ChatInput
         userData={userData} getUserMessages={getUsersMessages} getClickedUsersMessages={getClickedUsersMessages}/>
      </>
  
 </div>
            
        




    </div>
  );
};

export default Chat;
