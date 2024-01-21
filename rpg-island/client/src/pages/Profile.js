import { useState, useEffect } from "react";
import AuthModal from "../Components/AuthModal";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const userId = cookies.UserId;

  const ProfilePage = true;
  let navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleEditInfo = () => {
    navigate("/editinfo");
  };

  return (
    <div className="main">
      <Header 
            ProfilePage={ProfilePage}
      />

      <div className="home">
        <div className="container">
          <div className="btn">
            <button className="special-button" onClick={handleEditInfo}>
              Edycja profilu
            </button>
          </div>
        </div>

        <div className="profile">
          {cookies.AuthToken && user && (
            <p>Nazwa użytkownika: {user.username}</p>
          )}
          {cookies.AuthToken && user && <p>Email: {user.email}</p>}
          {cookies.AuthToken && user && <p>Imie: {user.first_name}</p>}
          {cookies.AuthToken && user && <p>Nazwisko: {user.second_name}</p>}
          {cookies.AuthToken && user && <p>Płeć: {user.gender_identity}</p>}
          {cookies.AuthToken && user && <p>Wiek: {user.age}</p>}
          {cookies.AuthToken && user && <p>Info: {user.about}</p>}
          {cookies.AuthToken && user && user.url && (
            <div className="url-container">
              <img src={user.url} alt="User Profile" className="profile-url" />
            </div>
          )}
          {showModal && (
            <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
          )}
        </div>
      </div>
      <ScrollTop />
      <Footer />
    </div>
  );
};

export default Profile;
