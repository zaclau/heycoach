import "./searchbar.css"

function SearchBar({ setSearchTerm, searchTerm, onSearch }) {
    return (
        <div className="d-flex justify-content-center">
            <div className="input-group w-50">
                <div className="input-group-text p-2 bg-dark rounded-start-pill flex-fill">
                    <input
                      type="text"
                      placeholder="search by Skill, Coach, or Experience"
                      className="headerSearchInput form-control text-white bg-dark rounded-start-pill"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="input-group-text p-2 bg-dark rounded-end-pill">
                    <button className="btn btn-light rounded-pill" onClick={onSearch}>
                      Search
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SearchBar