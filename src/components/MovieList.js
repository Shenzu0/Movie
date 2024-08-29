import React from 'react';


const MovieList = ({ movies, selectMovie }) => {
    return (
        <div className="movie-list">
            {movies.map(movie => (
                <Movie
                    selectMovie={selectMovie}
                    key={movie.id}
                    movie={movie}
                />
            ))}
        </div>
    );
}

export default MovieList;
