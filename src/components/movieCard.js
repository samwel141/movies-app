import React from 'react';
import './movieCard.css'; 

const MovieCard = ({ movie }) => {
  const { poster_path, title, release_date, vote_average, genre_ids, trailer } = movie;

  const genres = genre_ids.map(id => getGenreById(id)).join(', ');

  const handlePlayTrailer = () => {
    if (trailer) {
      window.open(trailer, '_blank');
    }
  };

  return (
    <div className="movie-card">
      <div className="poster-container">
        <img
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={title}
          height={280}
          width={280}
          className="movie-poster"
        />
        {trailer && (
          <button className="play-button" onClick={handlePlayTrailer}>
            Play
          </button>
        )}
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <p className="release-date">Release: {release_date}</p>
        <p className="genre">Genre: {genres}</p>
        <p className="rating">Rating: ⭐ {vote_average}</p>
      </div>
    </div>
  );
};

const getGenreById = (id) => {
  const genres = {
    27: 'Horror',
    18: 'Drama',
    878: 'Sci-Fi',
    // Add more genre mappings here
  };
  return genres[id] || 'Unknown';
};

export default MovieCard;
