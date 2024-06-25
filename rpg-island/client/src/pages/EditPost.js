import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";


const EditPost = () => {
  const [onePost, setPost] = useState(null);
  const { postId }  = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [formData2, setFormData2] = useState({
    user_id: cookies.UserId,
    nazwa_systemu: "",
    termin_sesji: "",
    ilosc_sesji: "",
    dlugosc_sesji: "",
    ilosc_graczy: "",
    scenariusz: "",
    bhs: "",
    opis: "",
    url: "",
    data_dodania: new Date().toLocaleString("pl-PL", {
      timeZone: "Europe/Warsaw",
    }),
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/postedit/${postId}`, {
        formData2,
      });
      const success = response.status === 200;
      if (success) {
        navigate("/myAnnoucements");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
      const value = e.target.value;
      const name = e.target.name;

      setFormData2((prevState) => ({
        ...prevState,
        [name]: value,
      }));
  };

  const getPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/onePost/${postId}`
      );

      setPost(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost();
  }, [postId]);

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  const handleAddAnnouncement = () => {
    navigate("/addAnnoucement");
  };

  const handleMyAnnoucements = () => {
    navigate("/myAnnoucements");
  };
  const handleMyApplications = () => {
    navigate("/myApplications");
  };

  return (
    <div className="main">
      <Header />

      <div className="home">
      <div className="container">
          <div className="btn">
            <button
              className="special-button"
              onClick={handleAddAnnouncement}
              disabled={!cookies.AuthToken}
            >
              Dodaj ogłoszenie
            </button>
          </div>

          <div className="btn2">
            <button
              onClick={handleMyAnnoucements}
              disabled={!cookies.AuthToken}
            >
              Twoje ogłoszenia
            </button>
          </div>

          <div className="btn">
            <button
              onClick={handleMyApplications}
              disabled={!cookies.AuthToken}
            >
              Moje zgłoszenia
            </button>
          </div>
        </div>
        <div className="createAnnoucement">
          <form className="addAnnoucement" onSubmit={handleSubmit}>
            <section>
              <label className="title" htmlFor="nazwa_systemu">
                Nazwa Systemu
              </label>
              <input
                id="nazwa_systemu"
                type="text"
                pattern="[\s\S]*"
                minLength={3}
                maxLength={32}
                name="nazwa_systemu" 
                placeholder={onePost?.nazwa_systemu}
                required={false}
                value={formData2.nazwa_systemu}
                onChange={handleChange}
              />

              <label htmlFor="termin_sesji">Termin pierwszej sesji</label>
              <input
                id="termin_sesji"
                type="date"
                name="termin_sesji"
                required={false}
                value={formData2.termin_sesji}
                onChange={handleChange}
                min={getCurrentDate()}
              />

              <label htmlFor="ilosc_sesji">Ilość sesji</label>
              <input
                id="ilosc_sesji"
                type="text"
                pattern="[1-9][0-9]?[0-9]?"
                name="ilosc_sesji"
                placeholder="Ilość sesji"
                required={false}
                value={formData2.ilosc_sesji}
                onChange={handleChange}
              />

              <label>Długość sesji</label>
              <input
                id="dlugosc_sesji"
                type="text"
                pattern="[[1-9][0-9]?]*"
                minLength={1}
                maxLength={32}
                name="dlugosc_sesji"
                placeholder="Długość sesji"
                required={false}
                value={formData2.dlugosc_sesji}
                onChange={handleChange}
              />

              <label>Ilość poszukiwanych graczy</label>
              <input
                id="ilosc_graczy"
                type="text"
                pattern="[1-9][0-9]?"
                name="ilosc_graczy"
                placeholder="Ilość poszukiwanych graczy"
                required={false}
                value={formData2.ilosc_graczy}
                onChange={handleChange}
              />

              <label>Scenariusz</label>
              <input
                id="scenariusz"
                type="text"
                pattern="[\s\S]*"
                minLength={3}
                maxLength={64}
                name="scenariusz"
                placeholder="Scenariusz"
                required={false}
                value={formData2.scenariusz}
                onChange={handleChange}
              />

              <label>BHS sesji</label>
              <input
                id="bhs"
                type="text"
                pattern="[\s\S]*"
                minLength={3}
                maxLength={64}
                name="bhs"
                placeholder="BHS"
                required={false}
                value={formData2.bhs}
                onChange={handleChange}
              />

              <label htmlFor="opis">Opis sesji</label>
              <input
                id="opis"
                type="text"
                name="opis"
                pattern="[\s\S]*"
                minLength={3}
                maxLength={512}
                required={false}
                placeholder="Opis..."
                value={formData2.opis}
                onChange={handleChange}
              />

              <input type="submit" />
            </section>
          </form>
        </div>
      </div>

      <ScrollTop />
      <Footer />
    </div>
  );
};

export default EditPost;
