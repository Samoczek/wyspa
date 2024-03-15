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
        <div className="rpg">
        Gry RPG, czyli gry fabularne, stanowią fascynującą formę rozrywki,
        której korzenie sięgają świata papierowych plansz i wyobraźni. RPG to
        skrót od angielskiego terminu "Role-Playing Game", co można
        przetłumaczyć jako "gra fabularna". W przeciwieństwie do tradycyjnych
        gier planszowych, w RPG uczestnicy nie poruszają po planszy pionkami,
        lecz wcielają się w role wymyślonych postaci, wchodząc w interakcję z
        wyimaginowanym światem stworzonym przez mistrza gry. Podstawowym
        elementem gier RPG jest narracja i wspólna konstrukcja historii. Mistrz
        gry, zwany także MG, pełni kluczową rolę, tworząc świat, postacie, oraz
        prowadząc fabułę. Gracze natomiast kierują losami swoich postaci,
        podejmują decyzje i podejmują wyzwania, co wpływa na rozwój opowiadanej
        historii. Charakterystyczną cechą gier RPG jest także system zasad,
        określający sposób rozstrzygania akcji, konfliktów i postępów postaci.
        Wiele gier RPG używa kostek do generowania losowych wyników, co dodaje
        elementu nieprzewidywalności i strategicznego podejścia. Gry RPG mają
        zdolność przekształcania zwykłego spotkania w niesamowitą przygodę,
        gdzie uczestnicy mają swobodę kształtowania świata oraz wpływ na rozwój
        historii. To także doskonała forma interakcji społecznej, współpracy 
        i rozwijania wyobraźni. Popularne systemy gier RPG to m.in. Dungeons &
        Dragons, Pathfinder, czy World of Darkness. Gry te zdobywają uznanie
        zarówno wśród doświadczonych graczy, jak i nowicjuszy, oferując
        niekończące się możliwości eksploracji fantastycznych światów i
        rozwijania kreatywności uczestników.
        </div>
      </div>

      <ScrollTop />

      <Footer />
    </div>
  );
};

export default Home;
