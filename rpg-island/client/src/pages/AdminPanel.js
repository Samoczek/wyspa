import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ShowDetailsButton from "../Components/ShowDetailsButton";
import ScrollTop from "../Components/ScrollTop";
import { Helmet } from "react-helmet";

const Annoucements = () => {
  const [cookies, , removeCookie] = useCookies(["user"]);
  const [posts, setPosts] = useState([]);
  const generatedPostId = cookies.UserId;
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  const [showDetails, setShowDetails] = useState(false);
  const [filterSessions, setFilterSessions] = useState("");
  const [filterSessionLength, setFilterSessionLength] = useState("");
  const [filterPlayers, setFilterPlayers] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [filterName, setFilterName] = useState("");

  const handleFilter = () => {
    getPosts();
  };

  const handleResetFilters = () => {
    setFilterTerm("");
    setFilterName("");
    setFilterSessions("");
    setFilterSessionLength("");
    setFilterPlayers("");
    getPosts();
  };

  const navigate = useNavigate();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const getPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/posts", {
        params: { generatedPostId },
      });

      const filteredPosts = response.data.filter(
        (post) =>
          (!filterTerm ||
            new Date(post.termin_sesji).getTime() ==
              new Date(filterTerm).getTime()) &&
          post.nazwa_systemu.toLowerCase().includes(filterName.toLowerCase()) &&
          (!filterSessions || post.ilosc_sesji == parseInt(filterSessions)) &&
          (!filterSessionLength ||
            post.dlugosc_sesji == parseInt(filterSessionLength)) &&
          (!filterPlayers || post.ilosc_graczy == parseInt(filterPlayers))
      );

      setPosts(filteredPosts);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, [filterTerm, filterName, filterSessions, filterSessionLength, filterPlayers]);


  const renderPageNumbers = () => {
    const totalPageNumbers = Math.ceil(posts.length / postsPerPage);
    const maxPagesToShow = Math.ceil(posts.length / postsPerPage);

    let leftBound = currentPage - Math.floor(maxPagesToShow / 2) + 1;

    let rightBound = currentPage + Math.floor(maxPagesToShow / 2);

    if (leftBound < 1) {
      rightBound += Math.abs(leftBound) + 1;
      leftBound = 1;
    }

    if (rightBound > totalPageNumbers) {
      leftBound -= rightBound - totalPageNumbers;
      rightBound = totalPageNumbers;
    }

    const pages = [];

    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    const renderedPages = pages.map((number) => (
      <li key={number}>
        <button
          onClick={() => setCurrentPage(number)}
          style={number === currentPage ? { backgroundColor: "lightblue" } : {}}
        >
          {number}
        </button>
      </li>
    ));

    return (
      <ul className="pagination">
        {currentPage > 1 && (
          <>
            <li>
              <button onClick={() => setCurrentPage(1)}>
                « pierwsza strona
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage(currentPage - 1)}>
                {"<"}
              </button>
            </li>
          </>
        )}
        {renderedPages.length > 0 && renderedPages}
        {currentPage < totalPageNumbers && (
          <>
            <li>
              <button onClick={() => setCurrentPage(currentPage + 1)}>
                {">"}
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage(totalPageNumbers)}>
                ostatnia strona »
              </button>
            </li>
          </>
        )}
      </ul>
    );
  };



  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleShowDetails = (postId) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleGoToAdminPanel = () => {
    navigate("/adminpanel");
  };

  const handleGoToUsersPanel = () => {
    navigate("/userspanel");
  };
  

  const Tooltip = ({ title, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div
        className="tooltip-container"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
        {showTooltip && (
          <div className="tooltip-bubble">
            <div className="tooltip-content">{title}</div>
          </div>
        )}
      </div>
    );
  };

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const handleDeletePost = (postId) => {
    setPostToDelete(postId);
    setConfirmationModal(true);
  };

  const handleConfirmAction = async (confirmation) => {
    if (confirmation && postToDelete) {
      try {
        await axios.delete(`http://localhost:8000/post/${postToDelete}`);
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postToDelete)
        );
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }

    setPostToDelete(null);
    setConfirmationModal(false);
  };

  return (
    <div className="main">
      <Helmet>
        <title>Panel Moderowania</title>
      </Helmet>
      <Header />

      <div className="home">
        <div className="annocuements">
          <div className="container">
            <div className="btn3">
              <button
                className="special-button"
                onClick={handleGoToAdminPanel}
                disabled={!cookies.AuthToken}
              >
                Ogłoszenia użytkowników
              </button>
            </div>

            <div className="btn">
              <button
                onClick={handleGoToUsersPanel}
                disabled={!cookies.AuthToken}
              >
                Panel z kontami użytkowników
              </button>
            </div>

          </div>
          <div className="filter-section">
            <input
              type="text"
              placeholder="Nazwa Systemu"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            <Tooltip title="Wpisz nazwę systemu, który cię interesuje">
              {" "}
              <p className="tooltip"> ? </p>
            </Tooltip>
            <input
              type="date"
              placeholder="Termin Sesji"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
            />
            <Tooltip title="Zaznacz datę, od której sesje cię interesują">
              {" "}
              <p className="tooltip"> ? </p>
            </Tooltip>
            <input
              type="number"
              placeholder="Ilość Sesji"
              value={filterSessions}
              onChange={(e) => setFilterSessions(e.target.value)}
            />
            <Tooltip title="Wpisz liczbę sesji, od której sesje cię interesują">
              {" "}
              <p className="tooltip"> ? </p>
            </Tooltip>
            <input
              type="number"
              placeholder="Długość Sesji"
              value={filterSessionLength}
              onChange={(e) => setFilterSessionLength(e.target.value)}
            />
            <Tooltip title="Wpisz długość sesji w godzinach">
              {" "}
              <p className="tooltip"> ? </p>
            </Tooltip>
            <input
              type="number"
              placeholder="Ilość Graczy"
              value={filterPlayers}
              onChange={(e) => setFilterPlayers(e.target.value)}
            />
            <Tooltip title="Wpisz ilość graczy na sesji, od której sesje cię interesują">
              {" "}
              <p className="tooltip"> ? </p>
            </Tooltip>
            <button onClick={handleResetFilters}>Resetuj filtry</button>
          </div>

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
              {currentPosts
                .filter(
                  (post) =>
                    (!filterTerm ||
                      new Date(post.termin_sesji).getTime() >=
                        new Date(filterTerm).getTime()) &&
                    post.nazwa_systemu
                      .toLowerCase()
                      .includes(filterName.toLowerCase()) &&
                    (!filterSessions ||
                      post.ilosc_sesji >= parseInt(filterSessions)) &&
                    (!filterSessionLength ||
                      post.dlugosc_sesji >= parseInt(filterSessionLength)) &&
                    (!filterPlayers ||
                      post.ilosc_graczy >= parseInt(filterPlayers))
                )
                .map((post) => (
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
                        onClick={() => handleShowDetails(post._id)}
                      >
                        Szczegóły
                      </button>

                      {showDetails[post._id] && (
                      <ShowDetailsButton postId={post._id} onClose={handleCloseDetails} />
   
                    )}

                      <button
                        className="ApplyButton"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <ul className="pagination">{renderPageNumbers()}</ul>
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

export default Annoucements;
