import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";
import { Helmet } from "react-helmet";

const Home = () => {
  const MainPage = true;

  return (
    <div className="main">
      <Helmet>
        <title>Strona Główna</title>
      </Helmet>

      <Header MainPage={MainPage} />

      <div className="home">

        Tutaj coś dopisać
      </div>

      <ScrollTop />

      <Footer />
    </div>
  );
};

export default Home;
