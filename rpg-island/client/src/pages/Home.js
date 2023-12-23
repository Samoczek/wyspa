
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';

import Footer from '../Components/Footer';
import Header from '../Components/Header';

const Home = () => {
  const [cookies, setCookie,  removeCookie] = useCookies(['user']);

    
    let navigate = useNavigate()


    const logout = async () => {
      removeCookie('UserId');
      removeCookie('AuthToken');
      window.location.reload();
  };


    const handleClickAnnoucements = () => {
            navigate('/annoucements')
    };


      //user={user}
      //cookies={cookies}
      //showModal={showModal}
     // setShowModal={setShowModal}
    // AuthModal={AuthModal}
    //  handleClicklog={handleClicklog}
    //  handleClickprofile={handleClickprofile}
    //  
    //  handleClick={handleClick}
     // isSignUp={isSignUp}

      return (
        <div className='main'>
      


        <Header 
        logout={logout}
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
