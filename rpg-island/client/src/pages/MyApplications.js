import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";

const MyApplications = () => {
  const [cookies, , removeCookie] = useCookies(["user"]);
  const { postId } = useParams();
  const [applications, setPosts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const userId = cookies.UserId;
  let navigate = useNavigate();

  const handleAddAnnouncement = () => {
    navigate("/addAnnoucement");
  };

  const handleMyAnnoucements = () => {
    navigate("/myAnnoucements");
  };
  const handleMyApplications = () => {
    navigate("/myApplications");
  };

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

  const deleteApplication = async (id) => {
    if (confirmDelete === id) {
      try {
        const response = await axios.delete(`http://localhost:8000/deleteApplication/${id}`);
    
        if (response.status === 200) {
          setConfirmDelete(null);
          getPosts(); 
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setConfirmDelete(id);
    }
  };
  
  useEffect(() => {
    getPosts();
  }, [userId]);

  const handleChat = (userId) => {
    console.log(userId);
    navigate(`/chat/${userId}`);
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

          <div className="btn4">
            <button
              onClick={handleMyApplications}
              disabled={!cookies.AuthToken}
            >
              Moje zgłoszenia
            </button>
          </div>
        </div>

        <div className="annocuements">
          <table>
            <thead>
              <tr>
                <th>Nazwa Systemu</th>
                <th>Scenariusz</th>
                <th>Data sesji</th>
                <th>Chat</th>
                <th>Usuń</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((applicant) => (
                <tr key={applicant._id}>
                  <td>{applicant.postname}</td>
                  <td>{applicant.postscenario}</td>
                  <td>{applicant.postdate}</td>
                  <td>
                    <button
                      className="ApplyButton"
                      onClick={() => handleChat(applicant.postUserId)}
                    >
                      Przejdź do chatu
                    </button>
                  </td>
                  <td>
                    <button
                      className="ApplyButton"
                      onClick={() => deleteApplication(applicant._id)}
                    >
                      {confirmDelete === applicant._id ? "Potwierdź usunięcie" : "Usuń"}
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

export default MyApplications;
