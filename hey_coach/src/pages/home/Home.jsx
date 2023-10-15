import Featured from "../../components/featured/Featured";
import FeaturedCoaches from "../../components/featuredCoaches/FeaturedCoaches";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Signup from "../../components/signup/Signup";
import Navbar from "../../components/navbar/Navbar";
import TopicList from "../../components/topicList/TopicList";
import "./home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header/>
      <div className="homeContainer">
        <Featured/>
        <h1 className="homeTitle">Browse by Topics</h1>
        <TopicList/>
        <h1 className="homeTitle">Coaches trainees love</h1>
        <FeaturedCoaches/>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
