
import React from 'react';
import './home.css'; 

const Home = () => {
//   const movies = [
//     { title: 'Movie 1', imageUrl: 'url_to_image_1' },
//     { title: 'Movie 2', imageUrl: 'url_to_image_2' },
//     { title: 'Movie 3', imageUrl: 'url_to_image_3' },
//   ];

  const welcomeCards = [
    {
      title: 'Welcome to Our Movie Platform',
      imageUrl: '/assets/images/image1.png',
      description: 'Discover a variety of movies to suit your taste. Enjoy watching!'
    },
    {
      title: 'Explore New Genres',
      imageUrl: '/assets/images/image2.png',
      description: 'From action to romance, we have it all. Dive into new experiences.'
    },
    {
      title: 'Join Our Community',
      imageUrl: '/assets/images/image3.png',
      description: 'Connect with fellow movie lovers and share your thoughts.'
    },
  ];

  return (
    <div className="home">
      <div className="welcome-section">
        <h2>Welcome</h2>
        <div className="welcome-grid">
          {welcomeCards.map((card, index) => (
            <div className="welcome-card" key={index}>
              <img src={card.imageUrl} alt={card.title} className="welcome-image" />
              <h3 className="welcome-title">{card.title}</h3>
              <p className="welcome-description">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="movie-grid">
        {movies.map((movie, index) => (
          <div className="movie-card" key={index}>
            <img src={movie.imageUrl} alt={movie.title} className="movie-image" />
            <h3 className="movie-title">{movie.title}</h3>
          </div>
        ))}
      </div> */}
      <div className='button'>
      <a href="/movies" className="big-button">Continue</a>
      </div>
    </div>
  );
};

export default Home;
