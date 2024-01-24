import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const ChatInput = ({ userData, getUserMessages, getClickedUsersMessages }) => {
  const [textArea, setTextArea] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const userId = cookies.UserId;
  const clickedUserId = userData.user_id;
  const [user, setUser] = useState(null);

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
  }, []);

  const addMessage = async () => {
    if (!textArea.trim()) {
      return;
    }
    const message = {
      timestamp: new Date().toISOString(),
      from_userId: userId,
      from_username: user.username,
      to_userId: clickedUserId,
      message: textArea,
    };

    try {
      await axios.post("http://localhost:8000/message", { message });
      getUserMessages();
      getClickedUsersMessages();
      setTextArea("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  return (
    <div className="chat-input">
      <textarea
        value={textArea}
        onChange={(e) => setTextArea(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="send-button" onClick={addMessage}>
        Wyślij
      </button>
    </div>
  );
};

export default ChatInput;
