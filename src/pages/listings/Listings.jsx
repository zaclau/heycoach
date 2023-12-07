/*
Implementer: Lennard

This implementation ties SearchBar.jsx and Listings very closely together

It allows for a dynamic search feature where the search results can be controlled via URL parameters,
enabling deep linking and bookmarking of specific search states.

handleSearchClick
- uses navigate to update the URL based on search query

useEffect
 - respond to changes in the URL's query parameters,
 - extract the search parameter,
 - update the local state with this search term,
 - perform a search based on this term.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import ListingCardForCoach from '../../components/listingCard/ListingCardForCoach';
import SearchBar from '../../components/searchBar/SearchBar';
import { graphQLFetch } from '../../graphQL/graphQLFetch';
import { useAuthContext } from '../../auth/auth';

const Listings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [coaches, setCoaches] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const userManagement = useAuthContext();
    console.log('userManagement: ', userManagement);

    // Listings.jsx
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search') || '';
        console.log('Search Query:', searchQuery); // Debugging line
        setSearchTerm(searchQuery);
        handleSearch(searchQuery);
    }, [location.search]);


    const fetchCoaches = async () => {
        const query = `
            query GetAllCoaches {
                getAllCoaches {
                    _id
                    firstName
                    lastName
                    profilePicture
                    profileAsCoach {
                        description
                        tagsOfSpecialties
                        sessionDuration
                        sessionPrice
                    }
                }
            }
        `;
        const data = await graphQLFetch(query);
        if (data) {
            setCoaches(data.getAllCoaches);
        }
    };

    const handleSearch = async (searchQuery) => {
        await fetchCoaches();
        setCoaches(prevCoaches => {
            return shuffleAndFilterArray(prevCoaches, searchQuery);
        });
    };

    const shuffleAndFilterArray = (array, query) => {
        let shuffledArray = array.filter(coach =>
            coach.profileAsCoach.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 30);

        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    const handleSearchClick = (query) => {
        // Navigate to the updated URL with search term
        navigate(`/listings?search=${encodeURIComponent(query)}`);
    };

    return (
        <>
            <div className="container my-3 mb-5">
                <SearchBar
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                    onSearch={handleSearchClick}
                />
            </div>
            {coaches.map(coach => (
                <ListingCardForCoach
                    key={coach._id}
                    firstName={coach.firstName}
                    lastName={coach.lastName}
                    description={coach.profileAsCoach.description}
                    price={coach.profileAsCoach.sessionPrice}
                    profilePicture={coach.profilePicture}
                    buttonDesc="View Profile"
                    buttonAction={() => navigate('/coaches/' + coach._id)}
                />
            ))}
        </>
    );
};

export default Listings;




//############################################
// V using button handler
//############################################

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import ListingCard from '../../components/listingCard/ListingCard';
// import SearchBar from '../../components/searchBar/SearchBar';
// import { graphQLFetch } from '../../graphQL/graphQLFetch';
//
// // useLocation hook
// import { useLocation } from "react-router-dom";
//
// const Listings = () => {
//     // State variables
//     const [searchTerm, setSearchTerm] = useState('');
//     const [coaches, setCoaches] = useState([]);
//     const navigate = useNavigate();
//
//     // Extract searchTerm for query params
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const searchQuery = queryParams.get('search');
//
//
//     // Handler to fetch coaches data from GraphQL API
//     const fetchCoaches = async () => {
//         const query = `
//             query GetAllCoaches {
//                 getAllCoaches {
//                     _id
//                     firstName
//                     lastName
//                     profilePicture
//                     profileAsCoach {
//                         description
//                         tagsOfSpecialties
//                         sessionDuration
//                         sessionPrice
//                     }
//                 }
//             }
//         `;
//
//         const data = await graphQLFetch(query);
//         if (data) {
//             setCoaches(data.getAllCoaches);
//         }
//     };
//
//     // Initiate search and filter based on searchQuery
//     useEffect(() => {
//         if (searchQuery) {
//             setSearchTerm(searchQuery);
//             handleSearch(searchQuery);
//         }
//     }, [searchQuery]);
//
//
//     // Handler to initiate search and filter
//     const handleSearch = async () => {
//         await fetchCoaches(); // Fetch all coaches again before filtering
//
//         setCoaches(prevCoaches => {
//             const filteredCoaches = prevCoaches
//                 .filter(coach => {
//                     const matchesDescription = searchTerm ? coach.profileAsCoach.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
//                     return matchesDescription;
//                 })
//                 .slice(0, 30); // Get top 30 matches
//
//             // Shuffle the array of filtered coaches
//             for (let i = filteredCoaches.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [filteredCoaches[i], filteredCoaches[j]] = [filteredCoaches[j], filteredCoaches[i]];
//             }
//
//             return filteredCoaches;
//         });
//     };
//
//     // Pass this function as a prop to the SearchBar component
//     const handleSearchClick = async () => {
//         await handleSearch();
//     };
//
//     return (
//         <>
//             <div className="container my-3 mb-5">
//                 <SearchBar
//                     setSearchTerm={setSearchTerm}
//                     searchTerm={searchTerm}
//                     onSearch={handleSearchClick} // Pass the handler here
//                 />
//             </div>
//
//             {coaches.map(coach => (
//                 <ListingCard
//                     key={coach._id}
//                     firstName={coach.firstName}
//                     lastName={coach.lastName}
//                     description={coach.profileAsCoach.description}
//                     price={coach.profileAsCoach.sessionPrice}
//                     profilePicture={coach.profilePicture}
//                     buttonDesc="View Profile"
//                     buttonAction={() => navigate('/coaches/' + coach._id)}
//                 />
//             ))}
//         </>
//     );
// };
//
// export default Listings;


//############################################
// V2 - uses a standin button to trigger search
//############################################

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
// import ListingCard from '../../components/listingCard/ListingCard';
// import SearchBar from '../../components/searchBar/SearchBar';
// import { graphQLFetch } from '../../graphQL/graphQLFetch';
//
// const Listings = () => {
//     // State variables
//     const [searchTerm, setSearchTerm] = useState('');
//     const [coaches, setCoaches] = useState([]);
//     const navigate = useNavigate();
//
//     // Handler to fetch coaches data from GraphQL API
//     const fetchCoaches = async () => {
//         const query = `
//             query GetAllCoaches {
//                 getAllCoaches {
//                     _id
//                     firstName
//                     lastName
//                     profilePicture
//                     profileAsCoach {
//                         description
//                         tagsOfSpecialties
//                         sessionDuration
//                         sessionPrice
//                     }
//                 }
//             }
//         `;
//
//         const data = await graphQLFetch(query);
//         if (data) {
//             setCoaches(data.getAllCoaches);
//         }
//     };
//
//     // Handler to initiate search and filter
//     const handleSearch = async () => {
//         await fetchCoaches(); // Fetch all coaches again before filtering
//
//         setCoaches(prevCoaches => {
//             const filteredCoaches = prevCoaches
//                 .filter(coach => {
//                     const matchesDescription = searchTerm ? coach.profileAsCoach.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
//                     return matchesDescription;
//                 })
//                 .slice(0, 30); // Get top 30 matches
//
//             // Shuffle the array of filtered coaches
//             for (let i = filteredCoaches.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [filteredCoaches[i], filteredCoaches[j]] = [filteredCoaches[j], filteredCoaches[i]];
//             }
//
//             return filteredCoaches;
//         });
//     };
//
//     return (
//         <>
//             <div className="container my-3">
//                 <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
//                 <button onClick={handleSearch} className="btn btn-primary">Search</button>
//             </div>
//
//             {coaches.map(coach => (
//                 <ListingCard
//                     key={coach._id}
//                     firstName={coach.firstName}
//                     lastName={coach.lastName}
//                     description={coach.profileAsCoach.description}
//                     price={coach.profileAsCoach.sessionPrice}
//                     profilePicture={coach.profilePicture}
//                     buttonDesc="View Profile"
//                     buttonAction={() => navigate('/coaches/' + coach._id)}
//                 />
//             ))}
//         </>
//     );
// };
//
// export default Listings;

//############################################
// V1
// keeps the selection state, everything updated dynamically
//############################################

// export default Listings;
//
//
// import React from 'react';
// import {graphQLFetch} from "../../graphQL/graphQLFetch";
//
// import { useState, useEffect, Fragment } from "react";
// import { useNavigate } from "react-router";
// import ListingCard from "../../components/listingCard/ListingCard";
// import SearchBar from "../../components/searchBar/SearchBar";
// import Filter from "../../components/filter/Filter";
//
// const topics = ["Health & Fitness", "Arts & Crafts", "Science & Tech", "Mental Health", "Food & Beverages"];
//
// const Listings = () => {
//     //############################################
//     // INITS
//     //############################################
//
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedTopics, setSelectedTopics] = useState([]);
//     const [coaches, setCoaches] = useState([]);
//     const navigate = useNavigate();
//
//     //############################################
//     // HANDLERS
//     //############################################
//
//     // Function to fetch coaches data from GraphQL API
//     const handleFetchCoaches = async () => {
//         const query = `
//             query GetAllCoaches {
//                 getAllCoaches {
//                     _id
//                     firstName
//                     lastName
//                     profilePicture
//                     profileAsCoach {
//                         description
//                         tagsOfSpecialties
//                         sessionDuration
//                         sessionPrice
//                     }
//
//                 }
//             }
//         `;
//         const data = await graphQLFetch(query);
//         return data.getAllCoaches;
//     };
//
//     // Function to filter coaches data based on search term and selected topics
//     const handleFilterCoaches = (coaches) => {
//         return coaches.filter(coach => {
//             const matchesDescription = searchTerm ? coach.profileAsCoach.description.includes(searchTerm) : true;
//             const matchesTopics = selectedTopics.length === 0 || selectedTopics.some(topic => coach.profileAsCoach.tagsOfSpecialties.includes(topic));
//             return matchesDescription && matchesTopics;
//         });
//     };
//
//     // useEffect to fetch and filter coaches whenever search term or selected topics change
//     useEffect(() => {
//         const fetchData = async () => {
//             const allCoaches = await handleFetchCoaches();
//             const filteredCoaches = handleFilterCoaches(allCoaches);
//             setCoaches(filteredCoaches.slice(0, 50)); // Display top 20 matches
//         };
//
//         fetchData();
//     }, [searchTerm, selectedTopics]);
//
//     // Function to update selected topics
//     const handleSelectTopic = topic => {
//         const isSelected = selectedTopics.includes(topic);
//         const newSelection = isSelected ? selectedTopics.filter(currentTopic => currentTopic !== topic) : [...selectedTopics, topic];
//         setSelectedTopics(newSelection);
//     };
//
//     //############################################
//     // RENDER
//     //############################################
//
//     return (
//         <Fragment>
//             <div className="container my-3">
//                 <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
//             </div>
//             <div className="container my-3">
//                 <Filter
//                     label="Topics"
//                     onapply={() => alert(selectedTopics)}
//                 >
//                     <div className="topics-list">
//                         {topics.map((topic, index) => (
//                             <div key={index}>
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedTopics.includes(topic)}
//                                     onChange={() => handleSelectTopic(topic)}
//                                 />
//                                 <span className="ml-2 text-base text-gray-500 font-heading">{topic}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </Filter>
//             </div>
//
//             {coaches.map(coach => (
//                 <ListingCard
//                     key={coach._id}
//                     firstName={coach.firstName}
//                     lastName={coach.lastName}
//                     description={coach.profileAsCoach.description}
//                     price={coach.profileAsCoach.sessionPrice}
//                     profilePicture={coach.profilePicture}
//                     buttonDesc="View Profile"
//                     buttonAction={() => navigate("/coaches/" + coach._id)}
//                 />
//             ))}
//         </Fragment>
//     );
// };
//
// export default Listings;
