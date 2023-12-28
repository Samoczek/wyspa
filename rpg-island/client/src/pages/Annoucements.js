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

const Annoucements = () => {
  const [cookies, , removeCookie] = useCookies(["user"]);
  const [posts, setPosts] = useState([]);
  const generatedPostId = cookies.UserId;
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [showDetails, setShowDetails] = useState(false);

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

          <div className="btn">
            <button
              onClick={handleMyApplications}
              disabled={!cookies.AuthToken}
            >
              Moje Zgłoszenia
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
              {currentPosts.map((post) => (
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
                      userId={generatedPostId}
                      postUserId={post.user_id}
                    />

                    {
                      <button
                        className="ApplyButton"
                        onClick={() => handleShowDetails(post._id)}
                      >
                        Szcegóły
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
