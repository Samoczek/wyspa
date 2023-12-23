import React from 'react';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import AuthModal from '../Components/AuthModal';
import axios from 'axios';

//user, cookies, showModal, handleClicklog, handleClickprofile, logout, handleClick, isSignUp, setShowModal, AuthModal
const Header = ({ logout }) => {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const [cookies, removeCookie] = useCookies(['user']);
    const userId = cookies.UserId;
    const AuthToken = false;

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



    const handleClickprofile = () => {
        if (cookies.AuthToken) {
            navigate('/profile');
        } else {
            console.log('Użytkownik nie jest zalogowany. Przejdź do formularza logowania.');
        }
    };

    const handleClicklog = () => {
        setShowModal(true);
        setIsSignUp(false);
      };

   
   
    return (
        <div className="header">
            {/* Welcome message */}
            {cookies.AuthToken && user && (
                <h3 className='wmessage'>Witaj: {user.username}</h3>
            )}

            {/* Login button */}
            {!cookies.AuthToken && (
                <button
                    className="button-special"
                    onClick={handleClicklog}
                    disabled={showModal || cookies.AuthToken}
                >
                    Zaloguj
                </button>
            )}

            {/* Profile button */}
            {cookies.AuthToken && (
            <button 
                className='button-special' 
                onClick={handleClickprofile} 
                disabled={!cookies.AuthToken}
            >
                Profil
            </button>
            )}

            {/* Logout/Signup button */}
            <button 
                className='button-special' 
                onClick={cookies.AuthToken ? logout : handleClick}
            >
                {cookies.AuthToken ? 'Wyloguj' : 'Utwórz konto'}
            </button>

            {/* Authentication Modal */}
            {showModal && (
                <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
            )}
        </div>
    );
};

export default Header;
