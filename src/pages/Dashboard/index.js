
import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/appContext';
import apiClient from '../../api/apiClient';

const GENRE_MAP = {
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


const Dashboard = ({ userId }) => {
  const [metrics, setMetrics] = useState({
    watchListCount: 0,
    favoritesCount: 0,
    genresDistribution: []
  });
  const [latestMovies, setLatestMovies] = useState([]);
  const [displayedMoviesCount, setDisplayedMoviesCount] = useState(5);
  const [sortOption, setSortOption] = useState('popularity.desc');
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlistIndex, setWatchlistIndex] = useState(0); 
  const [favoritesIndex, setFavoritesIndex] = useState(0); 
  const { profile } = useAppContext();

  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        const { data } = await apiClient.get(`/user/${profile?._id}/lists`);
        const { watch_list, favorites, genres } = data;

        const genreCounts = genres.reduce((acc, genreId) => {
          const genreName = GENRE_MAP[genreId] || 'Unknown';
          acc[genreName] = (acc[genreName] || 0) + 1;
          return acc;
        }, {});

        const genresDistribution = Object.entries(genreCounts).map(([genre, count]) => ({
          genre,
          count
        }));

        setMetrics({
          watchListCount: watch_list.length,
          favoritesCount: favorites.length,
          genresDistribution
        });
                


        const watchlistMoviesPromises = watch_list.map(id => apiClient.get(`/movies/${id}`));
        const watchlistMoviesResponses = await Promise.all(watchlistMoviesPromises);
        setWatchlistMovies(watchlistMoviesResponses.map(response => response.data));

        const favoriteMoviesPromises = favorites.map(id => apiClient.get(`/movies/${id}`));
        const favoriteMoviesResponses = await Promise.all(favoriteMoviesPromises);
        setFavoriteMovies(favoriteMoviesResponses.map(response => response.data));

      } catch (error) {
        console.error('Error fetching user lists:', error);
      }
    };

    const fetchLatestMovies = async () => {
      try {
        const { data } = await apiClient.get(`/movies?sort_by=${sortOption}`);
        setLatestMovies(data.movies.slice(0, 100));
      } catch (error) {
        console.error('Error fetching latest movies:', error);
      }
    };

    fetchUserLists();
    fetchLatestMovies();
  }, [userId, sortOption, profile?._id]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleViewMoreWatchlist = () => {
    setWatchlistIndex(prevIndex => {
      const nextIndex = prevIndex + 2; 
      return nextIndex < watchlistMovies.length ? nextIndex : prevIndex; 
    });
  };

  const handleViewLessWatchlist = () => {
    setWatchlistIndex(prevIndex => {
      const prevIndexValue = prevIndex - 2; 
      return prevIndexValue >= 0 ? prevIndexValue : 0; 
    });
  };

  const handleViewMoreFavorites = () => {
    setFavoritesIndex(prevIndex => {
      const nextIndex = prevIndex + 2; 
      return nextIndex < favoriteMovies.length ? nextIndex : prevIndex; 
    });
  };

  const handleViewLessFavorites = () => {
    setFavoritesIndex(prevIndex => {
      const prevIndexValue = prevIndex - 2; 
      return prevIndexValue >= 0 ? prevIndexValue : 0; 
    });
  };
  const handleViewMoreMovies = () => {
    setDisplayedMoviesCount(prevCount => prevCount + 5);
};

    const handlePlayTrailer = (trailer) => {
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
    };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4562'];

  const darkStyle = {
    backgroundColor: '#181818',
    color: '#fff',
    padding: '20px'
  };

  return (
    <Grid container spacing={4} style={{ backgroundColor: '#141414', minHeight: '100vh', padding: '20px' }}>
      {/* Key Metrics Section */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={darkStyle}>
          <Typography variant="h5" gutterBottom>
            Key Metrics
          </Typography>
          <Typography variant="h6" gutterBottom>
            Movies in Watchlist: {metrics.watchListCount}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Favorites: {metrics.favoritesCount}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Genres Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.genresDistribution}
                dataKey="count"
                nameKey="genre"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ genre }) => genre}
              >
                {metrics.genresDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Watch List Movies Section */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={darkStyle}>
          <Typography variant="h5" gutterBottom>
            Your Watchlist 
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: '#fff' }}>Image</TableCell>
                  <TableCell style={{ color: '#fff' }}>Title</TableCell>
                  <TableCell style={{ color: '#fff' }}>Release Date</TableCell>
                  <TableCell style={{ color: '#fff' }}>Popularity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {watchlistMovies.slice(watchlistIndex, watchlistIndex + 2).map((movie) => (
                  <TableRow key={movie.id} onClick={()=> handlePlayTrailer(movie.trailer)}>
                    <TableCell>
                      <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '50px', height: '50px' }} />
                    </TableCell>
                    <TableCell style={{ color: '#fff' }}>{movie.title}</TableCell>
                    <TableCell style={{ color: '#fff' }}>{movie.release_date}</TableCell>
                    <TableCell style={{ color: '#fff' }}>{movie.popularity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ marginTop: '20px' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleViewMoreWatchlist} 
              style={{ marginRight: '10px' }}
              disabled={watchlistIndex + 2 >= watchlistMovies.length}
            >
              View More
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleViewLessWatchlist} 
              disabled={watchlistIndex === 0} 
            >
              View Less
            </Button>
          </div>
        </Paper>

         {/* Favourites Movies Section */}
        <Paper elevation={3} style={darkStyle}>
          <Typography variant="h5" gutterBottom>
            Your Favourites 
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: '#fff' }}>Image</TableCell>
                  <TableCell style={{ color: '#fff' }}>Title</TableCell>
                  <TableCell style={{ color: '#fff' }}>Release Date</TableCell>
                  <TableCell style={{ color: '#fff' }}>Popularity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {favoriteMovies.slice(favoritesIndex, favoritesIndex + 2).map((movie) => (
                  <TableRow key={movie.id} onClick={()=> handlePlayTrailer(movie.trailer)}>
                    <TableCell>
                      <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '50px', height: '50px' }} />
                    </TableCell>
                    <TableCell style={{ color: '#fff' }}>{movie.title}</TableCell>
                    <TableCell style={{ color: '#fff' }}>{movie.release_date}</TableCell>
                    <TableCell style={{ color: '#fff' }}>{movie.popularity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ marginTop: '20px' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleViewMoreFavorites} 
              style={{ marginRight: '10px' }}
              disabled={favoritesIndex + 2 >= favoriteMovies.length} 
            >
              View More
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleViewLessFavorites} 
              disabled={favoritesIndex === 0} 
            >
              View Less
            </Button>
          </div>
        </Paper>
      </Grid>

     

       {/* Latest Movies Section */}
       <Grid item xs={12}>
         <Paper elevation={3} style={darkStyle}>
           <Typography variant="h5" gutterBottom>
             Latest Movies
           </Typography>
           <FormControl fullWidth style={{ marginBottom: '20px' }}>
             <InputLabel>Sort By</InputLabel>
            <Select value={sortOption} onChange={handleSortChange}>
               <MenuItem value="popularity.desc">Popularity Descending</MenuItem>
              <MenuItem value="popularity.asc">Popularity Ascending</MenuItem>
               <MenuItem value="release_date.desc">Release Date Descending</MenuItem>
               <MenuItem value="release_date.asc">Release Date Ascending</MenuItem>
             </Select>
           </FormControl>
          <TableContainer>
             <Table>
               <TableHead>
                 <TableRow>
                   <TableCell style={{ color: '#fff' }}>Image</TableCell>
                   <TableCell style={{ color: '#fff' }}>Title</TableCell>
                   <TableCell style={{ color: '#fff' }}>Release Date</TableCell>
                   <TableCell style={{ color: '#fff' }}>Popularity</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {latestMovies.slice(0, displayedMoviesCount).map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell>
                      <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '50px', height: '50px' }} />
                    </TableCell>
                    <TableCell style={{ color: '#fff' }}>{movie.title}</TableCell>
                    <TableCell style={{ color: '#fff' }}>{movie.release_date}</TableCell>
                    <TableCell style={{ color: '#fff' }}>{movie.popularity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleViewMoreMovies} 
            style={{ marginTop: '20px' }}
            disabled={displayedMoviesCount >= latestMovies.length}
          >
            View More
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
