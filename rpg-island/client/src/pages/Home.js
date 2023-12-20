import Nav from '../Components/Nav';
import { useState, useEffect } from 'react';
import AuthModal from '../Components/AuthModal';
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Home = () => {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const userId = cookies.UserId;

    
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

    return (
        <div>
            <Nav setShowModal={setShowModal} showModal={showModal} setIsSignUp={setIsSignUp} />
            <div className="home">
                Home
                {cookies.AuthToken && user && <p>{user.username}</p>}
                <button onClick={cookies.AuthToken ? logout : handleClick}>
                    {cookies.AuthToken ? 'Signout' : 'Create Account'}
                </button>
                {showModal && <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />}
            </div>
            <button onClick={handleClickprofile} disabled={!cookies.AuthToken}>
                    Profil
                </button>
                <button onClick={handleClickAnnoucements}>
                    Ogłoszenia
                </button>  

        </div>
    );
};

export default Home;
