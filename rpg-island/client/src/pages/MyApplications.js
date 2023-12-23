import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Footer from '../Components/Footer';

const MyApplications = () => {
    const [cookies, , removeCookie] = useCookies(['user']);
  const { postId } = useParams();
  const [ applications, setPosts ] = useState([]);
  const userId = cookies.UserId; 
  let navigate = useNavigate();

  const getPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/myapplications`, {
      params: { userId },
      withCredentials: true,
    });
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, [userId]);
  
  const logout = () => {
    removeCookie('UserId', cookies.UserId);
    removeCookie('AuthToken', cookies.AuthToken);
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/annoucements');
  };

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`);
  };


  return (
    <div className='main'>
      <div className='header'>

      

      <button className="button-special" onClick={logout}> Wyloguj </button>

      </div>

      <div className='home'>
        

        <div className='annocuements'>

        <div className='container'>
        <div className='btn'>
        <button onClick={handleGoBack}>Powrót do ogłoszeń</button>
        </div>
        </div>
        <table>

        <thead>
      <tr>
        <th>Nazwa Systemu</th>

      </tr>
    </thead>

    <tbody>
        {applications.map((applicant) => (
            <tr key={applicant._id}>
                <td> {applicant.postname} </td>
                <td><button className='ApplyButton' onClick={() => handleChat(applicant.userId)}>Przejdź do chatu</button></td>
      
            </tr>
        ))}
    </tbody>
</table>

</div>


</div>

<a id="back-to-top" href="#">👆🏼</a>
<Footer />

    </div>

  );
};

export default MyApplications;
