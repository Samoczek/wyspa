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
    show_gender: false,
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
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  const handleCheckboxChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <div className="main">
      <Header />

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

            <br />
            <label>
              <input
                type="checkbox"
                name="enable_gender_change"
                onChange={handleCheckboxChange}
                checked={formData.enable_gender_change}
              />
              Zaznacz by zmienić pole Płeć
            </label>
            <label>Płeć</label>
            <div className="multiple-input-container">
              <select
                id="gender-identity-dropdown"
                name="gender_identity"
                onChange={handleChange}
                value={formData.gender_identity}
                disabled={!formData.enable_gender_change}
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
            <label htmlFor="photo">Ikona na profilu</label>
            <input
              type="file"
              name="photo"
              id="photo"
              onChange={handleChange}
              required={false}
            />
            <div className="photo-container">
              {formData.photo && (
                <img src={formData.photo} alt="profile pic preview" />
              )}
            </div>
          </section>
        </form>
      </div>

      <ScrollTop />
      <Footer />
    </div>
  );
};

export default EditInfo;
