import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApplyButton from './ApplyButton';
import '../index.css';
import AuthModal from '../Components/AuthModal';

const Annoucements = () => {
  const [cookies, , removeCookie] = useCookies(['user']);
  const [posts, setPosts] = useState([]);
  const generatedPostId = cookies.UserId;
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; 

  const navigate = useNavigate();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);


  const getPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/posts', {
        params: { generatedPostId }
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
  
  const handleClicklog = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  const logout = () => {
    removeCookie('UserId', cookies.UserId);
    removeCookie('AuthToken', cookies.AuthToken);
    navigate('/');
  };

  const handleAddAnnouncement = () => {
    navigate('/addAnnoucement');
  };

  const handleMyAnnoucements = () => {
    navigate('/myAnnoucements')
  }
  const handleMyApplications = () => {
    navigate('/myApplications')
  }

  const handleGoBack = () => {
    navigate('/');
  };

  const renderPageNumbers = () => {
    const totalPageNumbers = Math.ceil(posts.length / postsPerPage);
    const maxPagesToShow = Math.ceil(posts.length / postsPerPage);

    // Oblicz granice
    let leftBound = currentPage - Math.floor(maxPagesToShow / 2) +1 ;

    let rightBound = currentPage + Math.floor(maxPagesToShow / 2);

    // Dostosuj granice, jeśli są poza zakresem stron
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
                style={number === currentPage ? { backgroundColor: 'lightblue' } : {}}
            >
                {number}
            </button>
        </li>
    ));

    return (
        <ul className='pagination'>
            {currentPage > 1 && (
                <>
                    <li>
                        <button onClick={() => setCurrentPage(1)}>« pierwsza strona</button>
                    </li>
                    <li>
                        <button onClick={() => setCurrentPage(currentPage - 1)}>{'<'}</button>
                    </li>
                </>
            )}
            {renderedPages.length > 0 && renderedPages}
            {currentPage < totalPageNumbers && (
                <>
                    <li>
                        <button onClick={() => setCurrentPage(currentPage + 1)}>{'>'}</button>
                    </li>
                    <li>
                        <button onClick={() => setCurrentPage(totalPageNumbers)}>ostatnia strona »</button>
                    </li>
                </>
            )}
        </ul>
    );
};








  return (
    <div className='Ogłoszenia'>
      <div className='header'>

            {!cookies.AuthToken && (
                <button
                    className="log-button"
                    onClick={handleClicklog}
                    disabled={showModal || cookies.AuthToken}
                >
                    Zaloguj
                </button>
            )}

            <button className='special-button' onClick={handleGoBack}>Strona główna</button>

            <button className="special-button" onClick={logout}> Logout </button>

      </div>

      <div>
        <button onClick={handleAddAnnouncement} disabled={!cookies.AuthToken}>Dodaj ogłoszenie</button>
      </div>

      <div>
        <button onClick={handleMyAnnoucements} disabled={!cookies.AuthToken}>Twoje ogłoszenia</button>
      </div>

      <div>
        <button onClick={handleMyApplications} disabled={!cookies.AuthToken}>Moje Zgłoszenia</button>
      </div>

      <div className='home'>
        <div className='annocuements'>
        <h2>Ogłoszenia</h2>
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
                  {/* Dodajemy guzik zapisywania się, przekazując postId i userId */}
                  <ApplyButton postId={post._id} userId={generatedPostId} />
                </td>
        </tr>
        
      ))}
          </tbody>
  </table>
  
    
  <ul className="pagination">
      {renderPageNumbers()}

    </ul>

 
    
        </div>
  

</div>
    </div>
  );
};

export default Annoucements;
