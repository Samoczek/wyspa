import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PostApplicated from './PostApplicated'
import { useCookies } from 'react-cookie';

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



  return (
    <div>
        <>
      <h2>Posty do których się zgłosiłem</h2>
      
      <ul>
      {applications.map((applicant) => (
        
    <PostApplicated userData={applicant} postId={applicant.postId} />
    
))}

</ul>

</>

    </div>

  );
};

export default MyApplications;
