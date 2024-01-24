import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";

const ApplicantsList = () => {
  const { postId } = useParams();
  const [applicants, setApplicants] = useState([]);
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
            <button className="special-button" onClick={handleAddAnnouncement}>
              Dodaj ogłoszenie
            </button>
          </div>

          <div className="btn2">
            <button onClick={handleMyAnnoucements}>Twoje ogłoszenia</button>
          </div>

          <div className="btn">
            <button onClick={handleMyApplications}>Moje zgłoszenia</button>
          </div>
        </div>

        <div className="annocuements">
          <table>
            <thead>
              <tr>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Wiek</th>
                <th>O mnie</th>
                <th>Płeć</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <tr key={applicant.userId}>
                  <td>{applicant.first_name}</td>
                  <td>{applicant.second_name}</td>
                  <td>{applicant.age}</td>
                  <td>{applicant.about}</td>
                  <td>{applicant.gender_identity}</td>
                  <td>
                    <button
                      className="ApplyButton"
                      onClick={() => handleChat(applicant.user_id)}
                    >
                      Przejdź do chatu
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ScrollTop />

      <Footer />
    </div>
  );
};

export default ApplicantsList;
