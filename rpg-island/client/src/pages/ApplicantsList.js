import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

const ApplicantsList = () => {
  const { postId } = useParams();
  const [applicants, setApplicants, setClickedUser] = useState([]);
  let navigate = useNavigate();



  const getApplicants = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/applicants/${postId}`);
      setApplicants(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApplicants();
  }, [postId]);

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`);
  };



  return (
    <div className='main'>
      <Header />
      <div className='home'>

      <ul>
  {applicants.map((applicant) => (
    <li key={applicant.userId}>
      ID: {applicant.user_id} <br />
      Imię: {applicant.first_name} <br />
      Nazwisko: {applicant.second_name} <br />
      Wiek: {applicant.age} <br />
      O mnie: {applicant.about} <br />
      Płeć: {applicant.gender_identity} <br />
      <br />
      <button onClick={() => handleChat(applicant.user_id)}>Przejdź do chatu</button>
      <br />

    </li>
  ))}
</ul>

      </div>
      
      <Footer />
    </div>
  );
};

export default ApplicantsList;
