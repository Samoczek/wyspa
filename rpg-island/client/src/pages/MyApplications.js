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
  const [applications, setPosts, SetPostInfo] = useState([]);
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

  const getPostInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/chat2post`, {
        params: { postId },
        withCredentials: true,
      });

      SetPostInfo(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
    getPostInfo();
  }, [userId]);

  const handleChat = (userId) => {
    console.log(userId);
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="main">
      <Header />

      <div className="home">
        <div className="annocuements">
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
                  <td>
                    <button
                      className="ApplyButton"
                      onClick={() => handleChat(applicant.postUserId)}
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

export default MyApplications;
