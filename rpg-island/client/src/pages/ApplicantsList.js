import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ApplicantsList = () => {
  const { postId } = useParams();
  const [applicants, setApplicants, setClickedUser] = useState([]);
  let navigate = useNavigate();

  console.log(postId)

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

  const handleMyAnnoucements = () => {
    navigate('/myAnnoucements');
  };

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`);
  };



  return (
    <div>
      <h2>Zgłoszeni użytkownicy do ogłoszenia</h2>
      <p>
        <button onClick={handleMyAnnoucements}> Powrót </button>
      </p>
      
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
  );
};

export default ApplicantsList;
