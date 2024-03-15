import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";

const AddAnnoucement = () => {
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

  const handleAddAnnouncement = () => {
    navigate("/addAnnoucement");
  };

  const handleMyAnnoucements = () => {
    navigate("/myAnnoucements");
  };
  const handleMyApplications = () => {
    navigate("/myApplications");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:8000/post", {
        formData2,
      });
      const success = response.status === 200;
      if (success) {
        navigate("/annoucements");
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

  const Tooltip = ({ title, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);
  
    return (
      <div
        className="tooltip-container"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
        {showTooltip && (
          <div className="tooltip-bubble">
            <div className="tooltip-content">{title}</div>
          </div>
        )}
      </div>
    );
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="main">
      <Header />
      <div className="home">
        <div className="container">
          <div className="btn3">
            <button
              className="special-button"
              onClick={handleAddAnnouncement}
              disabled={!cookies.AuthToken}
            >
              Dodaj ogłoszenie
            </button>
          </div>

          <div className="btn">
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
                placeholder="Nazwa Systemu"
                required={true}
                value={formData2.nazwa_systemu}
                onChange={handleChange}
              />
              <Tooltip title="Wpisz pełną nazwę systemu lub jej skrót"> <p className="tooltip"> ? </p>
              </Tooltip>

              <label htmlFor="termin_sesji">Termin pierwszej sesji</label>
              <input
                id="termin_sesji"
                type="date"
                name="termin_sesji"
                required={true}
                value={formData2.termin_sesji}
                onChange={handleChange}
                min={getCurrentDate()}
              />
              <Tooltip title="Zaznacz odpowiednią datę kiedy planujesz, aby odbyła się pierwsza sesja."> <p className="tooltip"> ? </p>
              </Tooltip>

              <label htmlFor="ilosc_sesji">Ilość sesji</label>
              <input
                id="ilosc_sesji"
                type="text"
                pattern="[1-9][0-9]?"
                g
                name="ilosc_sesji"
                placeholder="5"
                required={true}
                value={formData2.ilosc_sesji}
                onChange={handleChange}
              />
              <Tooltip title="Wpisz ilość sesji jaką planujesz przeprowadzić w ramach ogłoszenia"> <p className="tooltip"> ? </p>
              </Tooltip>

              <label>Długość sesji</label>
              <input
                id="dlugosc_sesji"
                type="text"
                pattern="[[1-9][0-9]?]*"
                minLength={1}
                maxLength={32}
                name="dlugosc_sesji"
                placeholder="czas sesji w godzinach"
                required={true}
                value={formData2.dlugosc_sesji}
                onChange={handleChange}
              />
              <Tooltip title="Wpisz średnią długość jednej sesji jaką planujesz przeprowadzić w ramach ogłoszenia w godzinach"> <p className="tooltip"> ? </p>
              </Tooltip>

              <label>Ilość poszukiwanych graczy</label>
              <input
                id="ilosc_graczy"
                type="text"
                pattern="[1-9][0-9]?"
                g
                name="ilosc_graczy"
                placeholder="6"
                required={true}
                value={formData2.ilosc_graczy}
                onChange={handleChange}
              />
              <Tooltip title="Wpisz ilość graczy jaką poszukujesz w ramach ogłoszenia"> <p className="tooltip"> ? </p>
              </Tooltip>

              <label>Scenariusz</label>
              <input
                id="scenariusz"
                type="text"
                pattern="[\s\S]*"
                minLength={3}
                maxLength={64}
                name="scenariusz"
                placeholder="Nazwa scenariusza"
                required={true}
                value={formData2.scenariusz}
                onChange={handleChange}
              />
              <Tooltip title="Wpisz nazwę scenariusza jaki planujesz przeprowadzić w ramach ogłoszenia"> <p className="tooltip"> ? </p>
              </Tooltip>

              <label>BHS sesji</label>
              <input
                id="bhs"
                type="text"
                pattern="[\s\S]*"
                minLength={3}
                maxLength={64}
                name="bhs"
                placeholder="BHS"
                required={true}
                value={formData2.bhs}
                onChange={handleChange}
              />
              <Tooltip title="Wpisz narzędzia bezpieczeństwa podczas sesji jaki planujesz wykorzystać. Możesz wpisać również 'brak'"> <p className="tooltip"> ? </p>
              </Tooltip>

              <label htmlFor="opis">Opis sesji</label>
              <input
                id="opis"
                type="text"
                name="opis"
                pattern="[\s\S]*"
                minLength={3}
                maxLength={512}
                required={true}
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

export default AddAnnoucement;
