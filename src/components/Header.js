import React from 'react';

const Header = ({ searchKey, handleSearchInputChange, fetchMovies, genres, selectedGenre, setSelectedGenre, sortOrder, setSortOrder }) => {
    return (
        <header className="center-max-size header">
            <span className={"brand"}>MovieHub</span>
            <form className="form" onSubmit={(event) => { event.preventDefault(); fetchMovies(); }}>
                <input
                    className="search"
                    type="text"
                    id="search"
                    value={searchKey}
                    onInput={handleSearchInputChange}
                    placeholder="Rechercher des films..."
                />
                <button className="submit-search" type="submit"><i className="fa fa-search"></i></button>
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                    <option value="">Tous les genres</option>
                    {genres.map(genre => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                </select>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="popularity.desc">Pertinence</option>
                    <option value="release_date.asc">Date ascendante</option>
                    <option value="release_date.desc">Date descendante</option>
                </select>
            </form>
        </header>
    );
}

export default Header;
