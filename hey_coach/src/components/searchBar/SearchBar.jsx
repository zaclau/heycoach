function SearchBar({ setSearchTerm, searchTerm, onSearch }) {
    return (
        <div>
            <div className="input-group mw-100">
                <input
                  type="text"
                  placeholder="search by Skill, Coach, or Experience"
                  className="headerSearchInput form-control"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="headerBtn btn btn-dark" onClick={onSearch}>
                  Search
                </button>
            </div>
        </div>
    );
}

export default SearchBar;