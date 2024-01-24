import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";

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
    gender_identity: "",
    url: "",
    about: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("http://localhost:8000/user", {
        formData,
      });
      const success = response.status === 200;
      if (success) navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prevState) => ({
            ...prevState,
            url: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      const value = e.target.value;
      const name = e.target.name;

      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
      setFormData((prevState) => ({
        ...prevState,
        username: response.data.username,
        first_name: response.data.first_name,
        second_name: response.data.second_name,
        age: response.data.age,
        gender_identity: response.data.gender_identity,
        url: response.data.url,
        about: response.data.about,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  const handleGoBack = () => {
    navigate("/profile");
  };

  return (
    <div className="main">
      <Header />

      <div className="home">
      <div className="container">
          <div className="btn">
            <button className="special-button" onClick={handleGoBack}>
              Powrót
            </button>
          </div>
          </div>
        <div className="createAnnoucement">
          <form onSubmit={handleSubmit}>
            <section>
              <label htmlFor="username">Nazwa użytkownika</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder={user?.username}
                required={false}
                value={formData.username}
                onChange={handleChange}
              />

              <label htmlFor="first_name">Imie</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                placeholder={user?.first_name}
                required={false}
                value={formData.first_name}
                onChange={handleChange}
              />

              <label htmlFor="second_name">Nazwisko</label>
              <input
                id="second_name"
                type="text"
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

              <label>Płeć</label>
              <div className="multiple-input-container">
                <select
                  id="gender-identity-dropdown"
                  name="gender_identity"
                  onChange={handleChange}
                  value={formData.gender_identity}
                >
                  <option value="Mężczyzna">Mężczyzna</option>
                  <option value="Kobieta">Kobieta</option>
                  <option value="Inne">Inne</option>
                </select>
              </div>

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

              <input type="submit" />
            </section>

            <section>
              <label htmlFor="url">Ikona na profilu</label>
              <input
                type="file"
                name="url"
                id="url"
                onChange={handleChange}
                required={false}
              />
              <div className="url-container">
                {formData.url && (
                  <img src={formData.url} alt="profile pic preview" />
                )}
              </div>
            </section>
          </form>
        </div>
      </div>

      <ScrollTop />
      <Footer />
    </div>
  );
};

export default EditInfo;
