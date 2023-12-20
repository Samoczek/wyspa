import ChatInput from './ChatInput'
import axios from 'axios'
import {useState, useEffect} from "react"
import { useCookies } from 'react-cookie';


const ChatDisplay = ({ userData }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const userId = userData?.user_id;
    const clickedUserId = cookies.UserId;
    const [usersMessages, setUsersMessages] = useState(null)
    const [clickedUsersMessages, setClickedUsersMessages] = useState(null)
    const clickedUser = userData?.user_id;

    //console.log(userData)

    const getUsersMessages = async () => {
     try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: { userId: userId, correspondingUserId: clickedUserId}
            })
         setUsersMessages(response.data)
        } catch (error) {
         console.log(error)
     }
    }

    const getClickedUsersMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: { userId: clickedUserId, correspondingUserId: userId}
            })
            setClickedUsersMessages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUsersMessages()
        getClickedUsersMessages()
    }, [])

    const messages = [];

    usersMessages?.forEach(message => {
      const formattedMessage = {};
      formattedMessage['name'] = userData?.first_name;
      formattedMessage['username'] = message.username;
      formattedMessage['message'] = message.message;
      formattedMessage['timestamp'] = message.timestamp;
    
      // Sprawdź, czy wiadomość już istnieje w tablicy
      if (!messages.find(m => m.timestamp === formattedMessage.timestamp)) {
        messages.push(formattedMessage);
      }
    });
    
    clickedUsersMessages?.forEach(message => {
      const formattedMessage = {};
      formattedMessage['name'] = clickedUser?.first_name;
      formattedMessage['message'] = message.message;
      formattedMessage['timestamp'] = message.timestamp;
    
      // Sprawdź, czy wiadomość już istnieje w tablicy
      if (!messages.find(m => m.timestamp === formattedMessage.timestamp)) {
        messages.push(formattedMessage);
      }
    });
    

    const descendingOrderMessages = messages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    
    return (
        <>
                <p>CHAT!</p>
            <div className="chat-display">
                {descendingOrderMessages.map((message, _index) => (
                    <div key={_index}>
                            <p>{message.username}</p>

                        <p>{message.message}</p>
                        
                    </div>
                ))}
            </div>
        
     <ChatInput
         userData={userData}
         clickedUser={clickedUser} getUserMessages={getUsersMessages} getClickedUsersMessages={getClickedUsersMessages}/>
        </>
    )
}

export default ChatDisplay