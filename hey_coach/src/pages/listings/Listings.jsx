import Footer from "../../components/footer/Footer";
import ListingCard from "../../components/listingCard/ListingCard"
import Navbar from "../../components/navbar/Navbar";
import SearchBar from "../../components/searchBar/SearchBar";
import FilterItem from "../../components/filteritem/FilterItem";
import DropdownMenu from "../../components/dropdownmenu/DropdownMenu";
import { useState } from "react";

const Listings = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div>
            <Navbar/>
            <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
            <FilterItem icon={"Skills"}>
              <DropdownMenu/>
            </FilterItem>
            <ListingCard/>
            <ListingCard/>
            <Footer/>
        </div>
    );
}

export default Listings;