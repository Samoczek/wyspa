import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApplyButton from "../Components/ApplyButton";
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
  const postsPerPage = 6;
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



  const AnnoucementsPage = true;

  const navigate = useNavigate();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const getPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/posts", {
        params: { generatedPostId },
      });
      setPosts(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleAddAnnouncement = () => {
    navigate("/addAnnoucement");
  };

  const handleMyAnnoucements = () => {
    navigate("/myAnnoucements");
  };
  const handleMyApplications = () => {
    navigate("/myApplications");
  };

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

  const handleShowDetails = (postId) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
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

  return (
    <div className="main">
      <Helmet>
        <title>Lista Ogłoszeń</title>
      </Helmet>
      <Header AnnoucementsPage={AnnoucementsPage} />

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

        <div className="filter-section">
        
        <input
          type="text"
          placeholder="Nazwa Systemu"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <Tooltip title="Wpisz nazwę systemu, który cię interesuje"> <p className="tooltip"> ? </p>
        </Tooltip>
        <input
          type="date"
          placeholder="Termin Sesji"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
        />
        <Tooltip title="Zaznacz datę, od której sesje cię interesują"> <p className="tooltip"> ? </p>
        </Tooltip>
        <input
          type="number"
          placeholder="Ilość Sesji"
          value={filterSessions}
          onChange={(e) => setFilterSessions(e.target.value)}
        />
        <Tooltip title="Wpisz liczbę sesji, od której sesje cię interesują"> <p className="tooltip"> ? </p>
        </Tooltip>
        <input
          type="number"
          placeholder="Długość Sesji"
          value={filterSessionLength}
          onChange={(e) => setFilterSessionLength(e.target.value)}
        />
        <Tooltip title="Wpisz długość sesji w godzinach"> <p className="tooltip"> ? </p>
        </Tooltip>
        <input
          type="number"
          placeholder="Ilość Graczy"
          value={filterPlayers}
          onChange={(e) => setFilterPlayers(e.target.value)}
        />
        <Tooltip title="Wpisz ilość graczy na sesji, od której sesje cię interesują"> <p className="tooltip"> ? </p>
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
            .filter((post) =>
              (!filterTerm ||
                new Date(post.termin_sesji).getTime() >=
                  new Date(filterTerm).getTime()) &&
              post.nazwa_systemu
                .toLowerCase()
                .includes(filterName.toLowerCase()) &&
              (!filterSessions || post.ilosc_sesji >= parseInt(filterSessions)) &&
              (!filterSessionLength ||
                post.dlugosc_sesji >= parseInt(filterSessionLength)) &&
              (!filterPlayers || post.ilosc_graczy >= parseInt(filterPlayers))
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
                    <ApplyButton
                      postId={post._id}
                      postname={post.nazwa_systemu}
                      postscenario={post.scenariusz}
                      userId={generatedPostId}
                      postUserId={post.user_id}
                      postdate={post.termin_sesji}
                    />

                    {
                      <button
                        className="ApplyButton"
                        onClick={() => handleShowDetails(post._id)}
                      >
                        Szczegóły
                      </button>
                    }
                    {showDetails[post._id] && (
                      <ShowDetailsButton
                        postId={post._id}
                        showDetails={showDetails}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="pagination">{renderPageNumbers()}</ul>
        </div>
      </div>
      <ScrollTop />
      <Footer />
    </div>
  );
};

export default Annoucements;