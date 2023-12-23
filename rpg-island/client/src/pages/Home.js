import { useState, useEffect } from 'react';
import AuthModal from '../Components/AuthModal';
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

const Home = () => {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const userId = cookies.UserId;
    const authToken = false;

    
    let navigate = useNavigate()


    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: { userId }
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

    const logout = () => {
        removeCookie('UserId');
        removeCookie('AuthToken');
        window.location.reload();
    };

    const handleClickprofile = () => {
        if (cookies.AuthToken) {
            navigate('/profile');
        } else {
            console.log('Użytkownik nie jest zalogowany. Przejdź do formularza logowania.');
        }
    };

    const handleClickAnnoucements = () => {
            navigate('/annoucements')
    };

    const handleClicklog = () => {
        setShowModal(true);
        setIsSignUp(false);
      };

      return (
        <div className='main'>
      
        <Header 
            user={user}
            cookies={cookies}
            showModal={showModal}
            setShowModal={setShowModal}
            AuthModal={AuthModal}
            handleClicklog={handleClicklog}
            handleClickprofile={handleClickprofile}
            logout={logout}
            handleClick={handleClick}
            isSignUp={isSignUp}
        />

    <div className="home">

    <div className='container'>
              
              <div className='btn'>

            <button onClick={handleClickAnnoucements}>
                Ogłoszenia
            </button>
</div></div>



        </div>
        <a id="back-to-top" href="#">👆🏼</a>
                <Footer />
                
                
    </div>

    
        
    );
                };
    

export default Home;
