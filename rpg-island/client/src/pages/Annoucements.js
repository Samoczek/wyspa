import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApplyButton from './ApplyButton';
import '../index.css';

const Annoucements = () => {
  const [cookies, , removeCookie] = useCookies(['user']);
  const [posts, setPosts] = useState([]);
  const generatedPostId = cookies.UserId;

  const navigate = useNavigate();

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

  return (
    <div className='Ogłoszenia'>
      <div>
        <button onClick={handleAddAnnouncement} disabled={!cookies.AuthToken}>Dodaj ogłoszenie</button>
      </div>

      <div>
        <button onClick={handleMyAnnoucements} disabled={!cookies.AuthToken}>Twoje ogłoszenia</button>
      </div>

      <div>
        <button onClick={handleMyApplications} disabled={!cookies.AuthToken}>Moje Zgłoszenia</button>
      </div>

      <div>
        <button onClick={handleGoBack}>Do strony głównej</button>
      </div>

      <div>
        <i className="log-out-button" onClick={logout}> Logout </i>
      </div>

      <div>
  <h2>Twoje ogłoszenia</h2>
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
        <th>Opis</th>
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
          <td>{post.opis}</td>
          <td>
                  {/* Dodajemy guzik zapisywania się, przekazując postId i userId */}
                  <ApplyButton postId={post._id} userId={generatedPostId} />
                </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
};

export default Annoucements;
