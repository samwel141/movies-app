
import React, { useEffect, useState } from 'react';
import MovieCard from '../../components/movieCard';
import apiClient from '../../api/apiClient';
import './movies.css'; 

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState('desc'); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGenres(); 
    fetchMovies(); 
  }, []);

  useEffect(() => {
    fetchMovies(); 
  }, [query, selectedGenre, year, rating, sortBy, sortOrder, page]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {
        query,
        genre: selectedGenre,
        year,
        rating,
        sort_by: `${sortBy}.${sortOrder}`, 
        page,
      };

      const response = await apiClient.get('/movies', { params });
      setMovies(response.data.movies || response.data); 
      setTotalPages(response.data.totalPages || 1); 
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await apiClient.get('/genres');
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); 
    fetchMovies();
  };

  return (
    <div className="movies-container">
      <div className="filters-container">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
          />
        </form>

        <div className="filters">
          <div className="filter">
            <label>Genre</label>
            <select onChange={(e) => setSelectedGenre(e.target.value)} value={selectedGenre}>
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter">
            <label>Year</label>
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div className="filter">
            <label>Rating</label>
            <input
              type="number"
              placeholder="Rating"
              min="0"
              max="10"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          <div className="filter">
            <label>Sort by</label>
            <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
              <option value="popularity">Popularity</option>
              <option value="release_date">Release Date</option>
              <option value="vote_average">Rating</option>
            </select>
          </div>

          <div className="filter">
            <label>Sort Order</label> 
            <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="movies-grid">
        {loading ? (
          <p>Loading...</p>
        ) : (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        )}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Movies;
