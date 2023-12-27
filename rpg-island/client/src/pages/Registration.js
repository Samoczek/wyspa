import {useState} from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Footer from '../Components/Footer';
import Header from '../Components/Header';

const Registration = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)

    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        username: "",
        first_name: "",
        second_name: "",
        age: "",
        gender_identity: "man",
        url: "",
        about: "",
    })


    let navigate = useNavigate()


const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const response = await axios.put('http://localhost:8000/user', { formData })
        const success = response.status === 200
        if (success) navigate('/')
    } catch (err) {
        console.log(err)
    }
}


const handleChange = (e) => {
    console.log('e', e)
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    const name = e.target.name


    setFormData((prevState) => ({
        ...prevState,
        [name]: value
    }))
}




return (
    <>
        <Header />


        <div className="main">
            <div className='home'>

            
             <div className="createAnnoucement">

            <form onSubmit={handleSubmit}>
                <section>
                <label htmlFor="username">Nazwa użytkownika</label>
                    <input
                        id="username"
                        type='text'
                        pattern= "[a-zA-Z0-9_.-]+$"
                        minLength={2}
                        maxLength={16}
                        name="username"
                        placeholder="Nazwa użytkownika"
                        required={true}
                        value={formData.username}
                        onChange={handleChange}
                    />


                    <label htmlFor="first_name">Imie</label>
                    <input
                        id="first_name"
                        type='text'
                        pattern= "[a-zA-Z]+$"
                        minLength={2}
                        maxLength={16}
                        name="first_name"
                        placeholder="Imie"
                        required={true}
                        value={formData.first_name}
                        onChange={handleChange}
                    />


                    <label htmlFor="second_name">Nazwisko</label>
                    <input
                        id="second_name"
                        type='text'
                        pattern= "[a-zA-Z]+$"
                        minLength={2}
                        maxLength={16}
                        name="second_name"
                        placeholder="Nazwisko"
                        required={true}
                        value={formData.second_name}
                        onChange={handleChange}
                    />


                    <label>Wiek</label>
                        <input
                            id="age"
                            type="number"
                            pattern='[1-9][0-9]?[0-9]?'
                            minLength={2}
                            maxLength={16}
                            name="age"
                            placeholder="Wiek"
                            required={true}
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


                    <label htmlFor="about">O mnie</label>
                    <input
                        id="about"
                        type="text"
                        name="about"
                        required={true}
                        placeholder="O mnie..."
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

            </div>

<Footer />

        </div>
   
        </>
        )
}


export default Registration


