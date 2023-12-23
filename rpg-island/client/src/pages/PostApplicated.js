import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const PostApplicated = ({ userData, postId }) => {
    const [cookies, , removeCookie] = useCookies(['user']);
    const [ userPosts, setPosts ] = useState([]);
    const userId = cookies.UserId; 
    let navigate = useNavigate();


    
  const getPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/myapplicatedpost/${postId}`, {

    });
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, [postId]);

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`);
  };
  

  return (
    <div className='annocuements'>
        
        <table>
          <tbody>
            {userPosts.map((post) => (
              <tr key={post._id}>
                <td>{post.nazwa_systemu}</td>
                <td>{post.termin_sesji}</td>
                <td>{post.ilosc_sesji}</td>
                <td>{post.dlugosc_sesji}</td>
                <td>{post.ilosc_graczy}</td>
                <td>{post.scenariusz}</td>
                <td>{post.bhs}</td>
                <td>{post.opis}</td>
                <br />
      <td><button onClick={() => handleChat(post.user_id)}>Przejdź do chatu</button></td>
      <br />
              </tr>
            ))}
          </tbody>
        </table>
      </div>


  );
  };

export default PostApplicated;
