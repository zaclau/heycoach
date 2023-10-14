import Footer from "../../components/footer/Footer";
import ListingCard from "../../components/listingCard/ListingCard"
import Navbar from "../../components/navbar/Navbar";
import SearchBar from "../../components/searchBar/SearchBar";
import { useState } from "react";

const Listings = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div>
            <Navbar/>
            <div className="container my-3">
                <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
            </div> 
            <ListingCard/>
            <ListingCard/>
            <Footer/>
        </div>
    );
}

export default Listings;