import Footer from "../Components/Footer";
import Header from "../Components/Header";
import ScrollTop from "../Components/ScrollTop";

const Home = () => {

  const MainPage = true;

  return (
    <div className="main">
      <Header 
      MainPage={MainPage}
      />

      <div className="home"></div>

      <ScrollTop />

      <Footer />
    </div>
  );
};

export default Home;
