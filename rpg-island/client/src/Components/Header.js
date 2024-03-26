import React from "react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import AuthModal from "../Components/AuthModal";
import axios from "axios";

const Header = ({ MainPage, AnnoucementsPage, ProfilePage }) => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const userId = cookies.UserId;
  const AuthToken = false;

  let navigate = useNavigate();

  const logout = async () => {
    removeCookie("UserId");
    removeCookie("AuthToken");
    navigate("/");
    window.location.reload();
  };

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

  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(true);
  };

  const handleClickprofile = () => {
    if (cookies.AuthToken) {
      navigate("/profile");
    } else {
      console.log(
        "Użytkownik nie jest zalogowany. Przejdź do formularza logowania."
      );
    }
  };

  const handleClicklog = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  const handleMainPage = () => {
    navigate("/");
  };

  const handleClickAnnoucements = () => {
    navigate("/annoucements");
  };

  return (
    <div className="header">
      {cookies.AuthToken && user && (
        <h3 className="wmessage">Witaj: {user.username}</h3>
      )}

      <button
        className={`button-special${MainPage ? "2" : ""}`}
        onClick={handleMainPage}
      >
        Strona główna
      </button>

      <button
        className={`button-special${AnnoucementsPage ? "2" : ""}`}
        onClick={handleClickAnnoucements}
      >
        Ogłoszenia
      </button>

      {!cookies.AuthToken && (
        <button
          className="button-special"
          onClick={handleClicklog}
          disabled={showModal || cookies.AuthToken}
        >
          Zaloguj
        </button>
      )}

      {cookies.AuthToken && (
        <button
        className={`button-special${ProfilePage ? "2" : ""}`}
          onClick={handleClickprofile}
          disabled={!cookies.AuthToken}
        >
          Profil
        </button>
      )}

      <button
        className="button-special"
        onClick={cookies.AuthToken ? logout : handleClick}
      >
        {cookies.AuthToken ? "Wyloguj" : "Utwórz konto"}
      </button>

      {showModal && (
        <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
      )}
    </div>
  );
};

export default Header;
