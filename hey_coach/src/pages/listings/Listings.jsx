import Footer from "../../components/footer/Footer";
import ListingCard from "../../components/listingCard/ListingCard"
import Navbar from "../../components/navbar/Navbar";
import SearchBar from "../../components/searchBar/SearchBar";
import Filter from "../../components/filter/Filter";
import { useState } from "react";
import { useNavigate } from "react-router";

const topics = ["Health & Fitness", "Arts & Crafts", "Science & Tech", "Mental Health", "Food & Beverages"];

const Listings = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTopics, setSelectedTopics] = useState([]);
    const navigate = useNavigate();

    const handleSelect = topics => {
      const isSelected = selectedTopics.includes(topics);
    /* If the option has already been selected, we remove it from the array. */
    /* Otherwise, we add it. */ 
      const newSelection = isSelected ? selectedTopics.filter(currentTop => currentTop !== topics) : [...selectedTopics, topics];
      setSelectedTopics(newSelection);
    };

    return (
      <div>
        <Navbar />
        <div className="container my-3">
          <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        </div>
        <div className="container my-3">
          <Filter
            label="Topics"
            onapply={() => alert(selectedTopics)}
          >
            <div className="topics-list">
              {topics.map((topic, index) => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <div key={index}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        handleSelect(topic);
                      }}
                    />
                    <span className="ml-2 text-base text-gray-500 font-heading">
                      {topic}
                    </span>
                  </div>
                );
              })}
            </div>
          </Filter>
        </div>
        <ListingCard buttonDesc="View Profile" buttonAction={ () => navigate("/coaches/1") }/>
        <ListingCard buttonDesc="View Profile" buttonAction={ () => navigate("/coaches/1") }/>
        <Footer />
      </div>
    );
  };

export default Listings;
