import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";


const MyAnnoucements = () => {
  const [cookies, , removeCookie] = useCookies(["user"]);
  const [posts, setPosts] = useState([]);
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

  const handleDeleteAnnouncement = async (postId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/post/${postId}`
      );
      const success = response.status === 200;
      if (success) {
        getPosts();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleViewApplicants = (postId) => {
    navigate(`/applicantsList/${postId}`);
  };

  return (
    <div className="main">
      <Header />

      <div className="home">
        <div className="container">
          <div className="btn">
            <button onClick={handleAddAnnouncement}>Dodaj ogłoszenie</button>
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
                      Usuń
                    </button>
                    <button
                      className="ApplyButton"
                      onClick={() => handleViewApplicants(post._id)}
                    >
                      Zobacz zgłoszenia
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
