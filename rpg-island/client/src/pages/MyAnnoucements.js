import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";

const MyAnnoucements = () => {
  const [cookies] = useCookies(["user"]);
  const [posts, setPosts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const userId = cookies.UserId;
  const navigate = useNavigate();

  const getPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/myposts`, {
        params: { userId },
        withCredentials: true,
      });

      setPosts(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, [userId]);

  const handleAddAnnouncement = () => {
    navigate("/addAnnoucement");
  };

  const handleMyAnnoucements = () => {
    navigate("/myAnnoucements");
  };
  const handleMyApplications = () => {
    navigate("/myApplications");
  };

  const handleDeleteAnnouncement = async (postId) => {
    if (confirmDelete === postId) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/post/${postId}`
        );
        const success = response.status === 200;
        if (success) {
          setConfirmDelete(null);
          getPosts();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setConfirmDelete(postId);
    }
  };

  const handleViewApplicants = (postId) => {
    navigate(`/applicantsList/${postId}`);
  };

  const handleNavigateEditPost = (postId) => {
    navigate(`/editPost/${postId}`);
  }

  return (
    <div className="main">
      <Header />

      <div className="home">
        <div className="container">
          <div className="btn">
            <button
              onClick={handleAddAnnouncement}
              disabled={!cookies.AuthToken}
            >
              Dodaj ogłoszenie
            </button>
          </div>

          <div className="btn2">
            <button
              onClick={handleMyAnnoucements}
              disabled={!cookies.AuthToken}
            >
              Twoje ogłoszenia
            </button>
          </div>

          <div className="btn">
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
                <th>Termin Sesji</th>
                <th>Ilość Sesji</th>
                <th>Długość Sesji</th>
                <th>Ilość Graczy</th>
                <th>Scenariusz</th>
                <th>BHS</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.nazwa_systemu}</td>
                  <td>{post.termin_sesji}</td>
                  <td>{post.ilosc_sesji}</td>
                  <td>{post.dlugosc_sesji}</td>
                  <td>{post.ilosc_graczy}</td>
                  <td>{post.scenariusz}</td>
                  <td>{post.bhs}</td>
                  <td>
                    <button
                      className="ApplyButton"
                      onClick={() => handleDeleteAnnouncement(post._id)}
                    >
                      {confirmDelete === post._id ? "Potwierdź usunięcie" : "Usuń"}
                    </button>

                    <button
                      className="ApplyButton"
                      onClick={() => handleViewApplicants(post._id)}
                    >
                      Zobacz zgłoszenia
                    </button>

                    <button
                      className="ApplyButton"
                      onClick={() => handleNavigateEditPost(post._id)}
                    >
                      Edytuj ogłoszenie
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

export default MyAnnoucements;
