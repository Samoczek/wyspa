import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

const EditInfo = () => {
    const [user, setUser] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const userId = cookies.UserId;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        username: "",
        first_name: "",
        second_name: "",
        age: "",
        show_gender: false,
        gender_identity: "man",
        url: "",
        about: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        try {
            const response = await axios.put('http://localhost:8000/user', { formData });
            const success = response.status === 200;
            if (success) navigate('/');
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        const name = e.target.name;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

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
    }, [userId]);

    const logout = () => {
        removeCookie('UserId', cookies.UserId);
        removeCookie('AuthToken', cookies.AuthToken);
        navigate('/');
      };
    
      const handleGoBack = () => {
        navigate('/profile');
      };

return (


    <div className='main'> 

    <Header />


        <div className="createAnnoucement">

            <form onSubmit={handleSubmit}>
                <section>
                <label htmlFor="username">Nazwa użytkownika</label>
                    <input
                        id="username"
                        type='text'
                        name="username"
                        placeholder={user?.username}
                        required={false}
                        value={formData.username}
                        onChange={handleChange}
                    />


                    <label htmlFor="first_name">Imie</label>
                    <input
                        id="first_name"
                        type='text'
                        name="first_name"
                        placeholder={user?.first_name}
                        required={false}
                        value={formData.first_name}
                        onChange={handleChange}
                    />


                    <label htmlFor="second_name">Nazwisko</label>
                    <input
                        id="second_name"
                        type='text'
                        name="second_name"
                        placeholder={user?.second_name}
                        required={false}
                        value={formData.second_name}
                        onChange={handleChange}
                    />


                    <label>Wiek</label>
                        <input
                            id="age"
                            type="number"
                            name="age"
                            placeholder={user?.age}
                            required={false}
                            value={formData.age}
                            onChange={handleChange}
                        />

                    <br/>
                    <label>Płeć</label>
                    <div className="multiple-input-container">
                        <input
                            id="man-gender-identity"
                            type="radio"
                            name="gender_identity"
                            value="man"
                            onChange={handleChange}
                            checked={formData.gender_identity === "man"}
                        />
                        <label htmlFor="man-gender-identity">Mężczyzna</label>
                        <input
                            id="woman-gender-identity"
                            type="radio"
                            name="gender_identity"
                            value="woman"
                            onChange={handleChange}
                            checked={formData.gender_identity === "woman"}
                        />
                        <label htmlFor="woman-gender-identity">Kobieta</label>
                        <input
                            id="more-gender-identity"
                            type="radio"
                            name="gender_identity"
                            value="more"
                            onChange={handleChange}
                            checked={formData.gender_identity === "more"}
                        />
                        <label htmlFor="more-gender-identity">Inne</label>
                    </div>


                    <label htmlFor="show-gender">Show Gender on my Profile</label>


                    <input
                        id="show-gender"
                        type="checkbox"
                        name="show_gender"
                        onChange={handleChange}
                        value={formData.show_gender}
                    />


                    <label htmlFor="about">O mnie</label>
                    <input
                        id="about"
                        type="text"
                        name="about"
                        required={false}
                        placeholder={user?.about}
                        value={formData.about}
                        onChange={handleChange}
                    />


                    <input type="submit"/>
                </section>


                <section>


                    <label htmlFor="url">Ikona na profilu</label>
                    <input
                        type="url"
                        name="url"
                        id="url"
                        onChange={handleChange}
                        required={false}
                    />
                    <div className="photo-container">
                        {formData.url && <img src={formData.url} alt="profile pic preview"/>}
                    </div>




                </section>


            </form>




        </div>

        <a id="back-to-top" href="#">👆🏼</a>
<Footer />
        </div>
        )
}


export default EditInfo


