import ChatInput from "../Components/ChatInput";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [cookies, removeCookie] = useCookies(["user"]);
  const { userId } = useParams();
  const [userData, setUser] = useState("");
  const MyUserId = cookies.UserId;
  const [usersMessages, setUsersMessages] = useState(null);
  const [clickedUsersMessages, setClickedUsersMessages] = useState(null);
  const chatDisplayRef = useRef(null);
  
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
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

  const getUsersMessages = async () => {
    try {
      if (MyUserId) {
        const response = await axios.get("http://localhost:8000/messages", {
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
        const response = await axios.get("http://localhost:8000/messages", {
          params: { userId: MyUserId, correspondingUserId: userId },
        });
        setClickedUsersMessages(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsersMessages();
    getClickedUsersMessages();
  }, []);

  useEffect(() => {
    chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
  }, [usersMessages, clickedUsersMessages]);

  const messages = [];

  usersMessages?.forEach((message) => {
    const formattedMessage = {};
    formattedMessage["username"] = message.from_username;
    formattedMessage["message"] = message.message;
    formattedMessage["timestamp"] = message.timestamp;

    if (!messages.find((m) => m.timestamp === formattedMessage.timestamp)) {
      messages.push(formattedMessage);
    }
  });

  clickedUsersMessages?.forEach((message) => {
    const formattedMessage = {};
    formattedMessage["username"] = message.to_username;
    formattedMessage["message"] = message.message;
    formattedMessage["timestamp"] = message.timestamp;

    if (!messages.find((m) => m.timestamp === formattedMessage.timestamp)) {
      messages.push(formattedMessage);
    }
  });

  const descendingOrderMessages = messages?.sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  
  const handleAddAnnouncement = () => {
    navigate("/addAnnoucement");
  };

  const handleMyAnnoucements = () => {
    navigate("/myAnnoucements");
  };
  const handleMyApplications = () => {
    navigate("/myApplications");
  };

  return (
    <div className="main">
      <Header />

      <div className="home">
      <div className="container">
          <div className="btn">
            <button
              className="special-button"
              onClick={handleAddAnnouncement}
              disabled={!cookies.AuthToken}
            >
              Dodaj ogłoszenie
            </button>
          </div>

          <div className="btn">
            <button
              onClick={handleMyAnnoucements}
              disabled={!cookies.AuthToken}
            >
              Twoje ogłoszenia
            </button>
          </div>

          <div className="btn">
            <button
              onClick={handleMyApplications}
              disabled={!cookies.AuthToken}
            >
              Moje zgłoszenia
            </button>
          </div>
        </div>

        {userData ? (
          <div className="UserChatInfo">
            <h2>
              Chat z użytkownikiem {userData.username}
            </h2>
            <p>Imię: {userData.first_name}</p>
            <p>Nazwisko: {userData.second_name}</p>
            <p>Wiek: {userData.age}</p>
            <p>O mnie: {userData.about}</p>
            <p>Płeć: {userData.gender_identity}</p>
          </div>
        ) : (
          <p className="loading">Ładowanie danych...</p>
        )}

        <div className="chat-container">
          <>
            <div className="chat-display" ref={chatDisplayRef}>
              {descendingOrderMessages.map((message, _index) => (
                <div key={_index}>
                  <h4>{message.username}</h4>

                  <p>{message.message}</p>
                </div>
              ))}
            </div>

            <ChatInput
              userData={userData}
              getUserMessages={getUsersMessages}
              getClickedUsersMessages={getClickedUsersMessages}
            />
          </>
        </div>
      </div>
      <ScrollTop />
      <Footer />
    </div>
  );
};

export default Chat;
