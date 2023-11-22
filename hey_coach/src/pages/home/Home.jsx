import React from 'react';
import Featured from "../../components/featured/Featured";
import FeaturedCoaches from "../../components/featuredCoaches/FeaturedCoaches";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Signup from "../../components/signup/Signup";
import TopicList from "../../components/topicList/TopicList";
import "./home.css";
import UserLanding from "../userLanding/UserLanding";
import {useAuthContext} from "../../auth/auth";

const Home = () => {
    const userManagement = useAuthContext();
    // Check if _uid is available
    const _uid = userManagement && userManagement.userStore ? userManagement.userStore._id : null;


  return (
    <div>
        <Header/>
        {/*<h1>"USER LANDING"</h1>*/}
        {_uid && <UserLanding/>}
    </div>
  );
};

export default Home;


// import React from 'react';
// import Featured from "../../components/featured/Featured";
// import FeaturedCoaches from "../../components/featuredCoaches/FeaturedCoaches";
// import Footer from "../../components/footer/Footer";
// import Header from "../../components/header/Header";
// import Signup from "../../components/signup/Signup";
// import TopicList from "../../components/topicList/TopicList";
// import "./home.css";
//
// const Home = () => {
//   return (
//     <div>
//       <Header/>
//       <div className="homeContainer">
//         <Featured/>
//         <h1 className="homeTitle">Browse by Topics</h1>
//         <TopicList/>
//         <h1 className="homeTitle">Coaches trainees love</h1>
//         <FeaturedCoaches/>
//         <Footer/>
//       </div>
//     </div>
//   );
// };
//
// export default Home;
