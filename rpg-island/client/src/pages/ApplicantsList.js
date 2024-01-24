import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";


const ApplicantsList = () => {
  const { postId } = useParams();
  const [applicants, setApplicants, setClickedUser] = useState([]);
  let navigate = useNavigate();

  const getApplicants = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/applicants/${postId}`
      );
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
            >
              Dodaj ogłoszenie
            </button>
          </div>

          <div className="btn2">
            <button
              onClick={handleMyAnnoucements}
            >
              Twoje ogłoszenia
            </button>
          </div>

          <div className="btn">
            <button
              onClick={handleMyApplications}
            >
              Moje zgłoszenia
            </button>
          </div>
        </div>
  <div className="UserChatInfo">
    {applicants.map((applicant) => (
      <p key={applicant.userId}>
        Imię: {applicant.first_name} <br />
        Nazwisko: {applicant.second_name} <br />
        Wiek: {applicant.age} <br />
        O mnie: {applicant.about} <br />
        Płeć: {applicant.gender_identity} <br />
        <br />
        <button onClick={() => handleChat(applicant.user_id)}>
          Przejdź do chatu
        </button>
        <br />
      </p>
    ))}
  </div>
</div>


      <ScrollTop />

      <Footer />
    </div>
  );
};

export default ApplicantsList;
