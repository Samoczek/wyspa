import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";
import { Helmet } from "react-helmet";

const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies(["user"]);
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setConfirmationModal(true);
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await axios.patch(`http://localhost:8000/toggleblock/${userId}`, {
        blocked: !isBlocked,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, blocked: !isBlocked } : user
        )
      );
    } catch (error) {
      console.error("Error toggling user block:", error);
    }
  };

  const handleConfirmAction = async (confirmation) => {
    if (confirmation && userToDelete) {
      try {
        await axios.delete(`http://localhost:8000/user/${userToDelete}`);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDelete)
        );
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }

    setUserToDelete(null);
    setConfirmationModal(false);
  };

  const handleGoToAdminPanel = () => {
    navigate("/adminpanel");
  };

  const handleGoToUsersPanel = () => {
    navigate("/userspanel");
  };

  return (
    <div className="main">
      <Helmet>
        <title>Panel Moderowania</title>
      </Helmet>
      <Header />
      <div className="home">
        <div className="announcements">
          <div className="container">
            <div className="btn">
              <button
                className="special-button"
                onClick={handleGoToAdminPanel}
                disabled={!cookies.AuthToken}
              >
                Ogłoszenia użytkowników
              </button>
            </div>

            <div className="btn2">
              <button
                onClick={handleGoToUsersPanel}
                disabled={!cookies.AuthToken}
              >
                Panel z kontami użytkowników
              </button>
            </div>
          </div>
          <div className="announcements">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nazwa użytkownika</th>
                  <th>Email</th>
                  <th>Imię</th>
                  <th>Nazwisko</th>
                  <th>Płeć</th>
                  <th>Wiek</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.first_name}</td>
                    <td>{user.second_name}</td>
                    <td>{user.gender_identity}</td>
                    <td>{user.age}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user._id)}>
                        Usuń
                      </button>
                      <button
                        onClick={() => handleBlockUser(user._id, user.blocked)}
                      >
                        {user.blocked ? "Odblokuj" : "Zablokuj"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {confirmationModal && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <p>Czy na pewno chcesz wykonać tę akcję?</p>
            <button onClick={() => handleConfirmAction(true)}>Tak</button>
            <button onClick={() => handleConfirmAction(false)}>Nie</button>
          </div>
        </div>
      )}

      <ScrollTop />
      <Footer />
    </div>
  );
};

export default UsersPanel;
