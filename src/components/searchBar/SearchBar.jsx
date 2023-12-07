
// SearchBar.jsx
import React from 'react';
import "./searchbar.css"

function SearchBar({ setSearchTerm, searchTerm, onSearch }) {
    const handleKeyPress = (event) => {
        // Trigger search when Enter key is pressed
        if (event.key === 'Enter'){
            onSearch(searchTerm);
        }
    }
    return (
        <div className="d-flex justify-content-center">
            <div className="input-group w-50">
                <div className="input-group-text p-2 bg-dark rounded-start-pill flex-fill">
                    <input
                        type="text"
                        placeholder="Search by Skill, Coach, or Experience"
                        className="headerSearchInput form-control text-white bg-dark rounded-start-pill"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e)}
                    />
                </div>

                <div className="input-group-text p-2 bg-dark rounded-end-pill">
                    <button
                        className="btn btn-light rounded-pill"
                        onClick={() => onSearch(searchTerm)}>
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SearchBar


// import React from 'react';
// import "./searchbar.css"
//
// function SearchBar({ setSearchTerm, searchTerm, onSearch }) {
//     // const handleKeyPress = (event) => {
//     //     // Trigger search when Enter key is pressed
//     //     if(event.key === 'Enter'){
//     //         onSearch();
//     //     }
//     // }
//
//     return (
//         <div className="d-flex justify-content-center">
//             <div className="input-group w-50">
//                 <input
//                     type="text"
//                     placeholder="Search by Skill, Coach, or Experience"
//                     className="headerSearchInput form-control text-white bg-dark rounded-start-pill"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     // onKeyPress={handleKeyPress}
//                 />
//                 <button className="btn btn-light rounded-end-pill" onClick={onSearch}>
//                     Search
//                 </button>
//             </div>
//         </div>
//     );
// }
//
// export default SearchBar

