import React from 'react';
import Youtube from 'react-youtube';

const Trailer = ({ playing, trailer, movie, handlePlayTrailer, setPlaying, BACKDROP_PATH }) => {
    return (
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
    );
}

export default Trailer;
