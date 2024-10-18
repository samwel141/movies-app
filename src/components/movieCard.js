

import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAppContext } from '../context/appContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faClock } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import './movieCard.css';

const MovieCard = ({ movie }) => {
  const { poster_path, title, release_date, vote_average, genre_ids, trailer, id: movieId } = movie;
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const { profile } = useAppContext();

  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        const token = localStorage.getItem('mov-token'); 
        const response = await apiClient.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIsFavorite(response?.data?.user?.favorites?.includes(movieId));
        setInWatchlist(response?.data?.user?.watch_list?.includes(movieId));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserLists();
  }, [movieId]);

  const genres = genre_ids?.map(id => getGenreById(id)).join(', ');

  const handlePlayTrailer = async () => {
    const token = localStorage.getItem('mov-token'); 
    if (!token) {
      toast.info('You must be logged in to play the movie.'); 
      return;
    }

    try {
      const genreId = genre_ids[0]; 
      const url = `/user/${profile?.id}/genres`;
      await apiClient.post(url, { genreId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (trailer) {
        const trailerWindow = window.open('', '_blank', 'width=800,height=600');
  
        if (trailerWindow) {
          let videoContent;
  
          if (trailer.includes('youtube.com') || trailer.includes('youtu.be')) {
            const videoId = trailer.split('v=')[1]?.split('&')[0] || trailer.split('/').pop();
            videoContent = `
              <iframe width="100%" height="100%" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            `;
          } else if (trailer.endsWith('.mp4')) {
            videoContent = `
              <video controls autoplay style="width: 100%; height: auto;">
                <source src="${trailer}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            `;
          } else {
            videoContent = `<p>Unable to play the video. <a href="${trailer}" target="_blank">Click here to watch</a>.</p>`;
          }
  
          const htmlContent = `
            <html>
              <head>
                <title>Movie Trailer</title>
                <style>
                  body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                  }
                  iframe, video {
                    width: 100%;
                    height: 100%;
                    max-width: 100%;
                  }
                </style>
              </head>
              <body>
                ${videoContent}
              </body>
            </html>
          `;
  
          trailerWindow.document.write(htmlContent);
          trailerWindow.document.close();
        } else {
          alert('Popup blocked. Please allow popups for this site.');
        }
      }
    } catch (error) {
      console.error('Error storing genre or playing trailer:', error);
      toast.error('Failed to play the trailer or store the genre.');
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('mov-token'); 
    if (!token) {
      toast.info('You must be logged in to like movies.'); 
      return;
    }

    try {
      const url = `/user/${profile.id}/favorites`;

      if (isFavorite) {
        await apiClient.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
          data: { movieId }  
        });
      } else {
        await apiClient.post(url, { movieId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setIsFavorite(!isFavorite); 
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleToggleWatchlist = async () => {
    const token = localStorage.getItem('mov-token'); 
    if (!token) {
      toast.info('You must be logged in to add to watchlist.'); 
      return;
    }

    try {
      const url = `/user/${profile.id}/watchlist`; 

      if (inWatchlist) {
        await apiClient.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
          data: { movieId }  
        });
      } else {
        await apiClient.post(url, { movieId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setInWatchlist(!inWatchlist); 
    } catch (error) {
      console.error('Error toggling watchlist:', error);
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
        <div className="movie-title-container">
          <h3 className="movie-title">{title}</h3>
          <div className="icons-container">
            <FontAwesomeIcon 
              icon={faHeart} 
              className={`icon like-icon ${isFavorite ? 'active' : ''}`}
              onClick={handleToggleFavorite}
              style={{ color: isFavorite ? 'red' : 'gray' }}
            />
            <FontAwesomeIcon 
              icon={faClock} 
              className={`icon watchlist-icon ${inWatchlist ? 'active' : ''}`}
              onClick={handleToggleWatchlist}
              style={{ color: inWatchlist ? 'green' : 'gray' }}
            />
          </div>
        </div>
        <p className="release-date">Release: {release_date}</p>
        <p className="genre">Genre: {genres}</p>
        <p className="rating">Rating: ⭐ {vote_average}</p>
      </div>
    </div>
  );
};

const getGenreById = (id) => {
  const genres = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
  return genres[id] || 'Unknown';
};

export default MovieCard;
