import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";

const EditPost = () => {
  const [onePost, setPost] = useState(null);
  const { postId } = useParams();
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
      const response = await axios.put(
        `http://localhost:8000/postedit/${postId}`,
        {
          formData2,
        }
      );
      const success = response.status === 200;
      if (success) {
        navigate("/myAnnoucements");
      }
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
          setFormData2((prevState) => ({
            ...prevState,
            url: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      const name = e.target.name;

      setFormData2((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
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

  return (
    <div className="main">
      <Header />

      <div className="home">
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
                type="text"
                pattern="[0-3]?[0-9][.][0-1]?[0-9][.][0-9][0-9][0-9][0-9]"
                name="termin_sesji"
                placeholder="Termin sesji"
                required={false}
                value={formData2.termin_sesji}
                onChange={handleChange}
              />

              <label htmlFor="ilosc_sesji">Ilość sesji</label>
              <input
                id="ilosc_sesji"
                type="text"
                pattern="[1-9][0-9]?[0-9]?"
                g
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
                pattern="[\s\S]*"
                minLength={2}
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
                g
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

              <label htmlFor="opis">Opis sesji.</label>
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

            <section>
              <label htmlFor="photo">Ikona ogłoszenia</label>
              <input
                type="file"
                name="photo"
                id="photo"
                onChange={handleChange}
                required={false}
              />
              <div className="photo-container">
                {formData2.photo && (
                  <img src={formData2.photo} alt="profile pic preview" />
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

export default EditPost;
