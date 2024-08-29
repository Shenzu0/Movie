import React, { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';
import Movie from "./components/Movie";
import Youtube from 'react-youtube';

function App() {
    const MOVIE_API = "https://api.themoviedb.org/3/";
    const SEARCH_API = MOVIE_API + "search/movie";
    const DISCOVER_API = MOVIE_API + "discover/movie";
    const API_KEY = "90f90dfc519fb9de7a8406da9eb2ef87";
    const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

    const [playing, setPlaying] = useState(false);
    const [trailer, setTrailer] = useState(null);
    const [movies, setMovies] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [movie, setMovie] = useState({ title: "Chargement des films" });
    const [selectedGenre, setSelectedGenre] = useState("");
    const [sortOrder, setSortOrder] = useState("popularity.desc");
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetchMovies();
    }, [searchKey, selectedGenre, sortOrder]);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchMovies = async () => {
        const { data } = await axios.get(`${searchKey ? SEARCH_API : DISCOVER_API}`, {
            params: {
                api_key: API_KEY,
                query: searchKey,
                with_genres: selectedGenre,
                sort_by: sortOrder
            }
        });

        setMovies(data.results);
        setMovie(data.results[0]);

        if (data.results.length) {
            await fetchMovie(data.results[0].id);
        }
    }

    const fetchGenres = async () => {
        const { data } = await axios.get(`${MOVIE_API}genre/movie/list`, {
            params: {
                api_key: API_KEY,
            }
        });
        setGenres(data.genres);
    }

    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos"
            }
        });

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(vid => vid.name === "Official Trailer");
            setTrailer(trailer ? trailer : data.videos.results[0]);
        }

        setMovie(data);
    }

    const selectMovie = (movie) => {
        fetchMovie(movie.id);
        setPlaying(false);
        setMovie(movie);
        window.scrollTo(0, 0);
    }

    const renderMovies = () => (
        movies.map(movie => (
            <Movie
                selectMovie={selectMovie}
                key={movie.id}
                movie={movie}
            />
        ))
    )

    const handleSearchInputChange = (event) => {
        setSearchKey(event.target.value);
    }

    const handlePlayTrailer = () => {
        setPlaying(true);
        setTimeout(() => {
            const iframe = document.querySelector('.youtube iframe');
            if (iframe && iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe && iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();
            } else if (iframe && iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            } else if (iframe && iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
            }
        }, 1000); // Delay to allow YouTube player to initialize
    };

    return (
        <div className="App">
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
            {movies.length ?
                <main>
                    {movie ?
                        <div className="poster"
                            style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})` }}>
                            {playing ?
                                <>
                                    <Youtube
                                        videoId={trailer.key}
                                        className={"youtube amru"}
                                        containerClassName={"youtube-container amru"}
                                        opts={{
                                            width: '100%',
                                            height: '100%',
                                            playerVars: {
                                                autoplay: 1,
                                                controls: 0,
                                                cc_load_policy: 0,
                                                fs: 1, // Enable fullscreen button
                                                iv_load_policy: 0,
                                                modestbranding: 0,
                                                rel: 0,
                                                showinfo: 0,
                                            },
                                        }}
                                    />
                                    <div className="video-controls">
                                        <button onClick={() => setPlaying(false)} className={"button close-video"}>Fermer</button>
                                        <span className="fullscreen-hint">Double-cliquez pour ouvrir en plein écran</span>
                                    </div>
                                </> :
                                <div className="center-max-size">
                                    <div className="poster-content">
                                        {trailer ?
                                            <button className={"button play-video"} onClick={handlePlayTrailer} type="button">Lire la bande-annonce</button>
                                            : 'Désolé, aucune bande-annonce disponible'}
                                        <h1>{movie.title}</h1>
                                        <p>{movie.overview}</p>
                                    </div>
                                </div>
                            }
                        </div>
                        : null}

                    <div className={"center-max-size container"}>
                        {renderMovies()}
                    </div>
                </main>
                : 'Désolé, aucun film trouvé'}
        </div>
    );
}

export default App;
