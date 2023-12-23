import React from 'react';

const Header = ({ user, cookies, showModal, handleClicklog, handleClickprofile, logout, handleClick, isSignUp, setShowModal, AuthModal }) => {
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
