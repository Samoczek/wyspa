import { useState, useEffect } from 'react';
import AuthModal from '../Components/AuthModal';
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

const Profile = () => {

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
    
        const logout = () => {
            removeCookie('UserId');
            removeCookie('AuthToken');
            navigate ('/')
            window.location.reload();

        };
    
        const handleClickhome = () => {
            navigate ('/')
        };

        const handleEditInfo = () => {
            navigate ('/editinfo')
        };
    
        return (

            

            <div>
                <div className="header">
                <button className='special-button'  onClick={handleEditInfo}>
                        Edycja profilu
                    </button>
                

                <button className='special-button' onClick={handleClickhome}>
                        Strona Główna
                    </button>
                    <button className='special-button' onClick={logout}>
                    {'Wyloguj'}
                </button>

                </div>

                <div className="profile">
                    {cookies.AuthToken && user && <p>Nazwa użytkonika: {user.username}</p>}
                    {cookies.AuthToken && user && <p>Email: {user.email}</p>}
                    {cookies.AuthToken && user && <p>Imie: {user.first_name}</p>}
                    {cookies.AuthToken && user && <p>Nazwisko: {user.second_name}</p>}
                    {cookies.AuthToken && user && <p>Płeć: {user.gender_identity}</p>}
                    {cookies.AuthToken && user && <p>Wiek: {user.age}</p>}
                    {cookies.AuthToken && user && <p>Info: {user.about}</p>}
                    {showModal && <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />}
                </div>
                
    
                <Footer />

            </div>
        );
    };
    
    

export default Profile;
