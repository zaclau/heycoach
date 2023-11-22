import React from 'react';
// import Featured from "../../components/featured/Featured";
// import FeaturedCoaches from "../../components/featuredCoaches/FeaturedCoaches";
// import Footer from "../../components/footer/Footer";
// import Header from "../../components/header/Header";
// import Signup from "../../components/signup/Signup";
// import TopicList from "../../components/topicList/TopicList";
import "./userLanding.css";
// import SearchBar from "../../components/searchBar/SearchBar";

// New
import ListingsForSessionsUpcoming from "../listingsForSessionsUpcoming/ListingsForSessionsUpcoming";
import HeaderUser from "../../components/headerUser/HeaderUser";
import ListingsForSessionsCompleted from "../listingsForSessionsCompleted/ListingsForSessionsCompleted";

const _uid = "655db2fa0daf3eeeb1f84fa6"
const UserLanding = () => {
  return (
    <div>
      <HeaderUser/>

      <div className="row justify-content-center mb-5">
        <div className="col-8 p-4 mb-3 border border-1 rounded-4" style={{ backgroundColor: '#e6f9e6' }}>
          <h2 className="fw-bold mt-5 mb-5">Upcoming Sessions</h2>
          <ListingsForSessionsUpcoming userId = {_uid}/>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-8 p-4 mb-3 border border-1 rounded-4" style={{ backgroundColor: '#e6f2f9' }}>
          <h2 className="fw-bold mt-5 mb-5">Completed Sessions</h2>
          <ListingsForSessionsCompleted userId = {_uid}/>
        </div>
      </div>
    </div>

  );
};

export default UserLanding;
