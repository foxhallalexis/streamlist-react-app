import { useEffect, useState } from "react";
import "./Movies.css";

function Movies() {
    const [popularMovies, setPopularMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");

    const token = process.env.REACT_APP_TMDB_TOKEN;

    /* load movie categories when the page opens */
    useEffect(() => {
        const fetchTopRatedMovies = async () => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Top Rated API response:", data);
      throw new Error(
        data.status_message || "Could not load top rated movies."
      );
    }

    console.log("Top Rated movies:", data.results);
    setTopRatedMovies(data.results || []);
  } catch (error) {
    console.error("Top Rated TMDB Error:", error);
    setError(error.message);
  }
};
        const fetchUpcomingMovies = async () => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&region=US",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Could not load upcoming movies.");
    }

    const data = await response.json();
    setUpcomingMovies(data.results || []);
  } catch (error) {
    console.error("Upcoming TMDB Error:", error);
  }
};
        const fetchNowPlayingMovies = async () => {
            try {
                const response = await fetch(
                    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&region=US",
                    {
                        headers: {
                            accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Could not load Now Playing movies.");
                }
                const data = await response.json();
                setNowPlayingMovies(data.results || []);
                } catch (error) {
                    console.error("Now Playing TMDB Error:", error);
                }
            };
        const fetchPopularMovies = async () => {
            try { 
                const response = await fetch(
                    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
                    {
                        headers: {
                            accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Could not load popular movies.");
                }

                const data = await response.json();
                setPopularMovies(data.results || []);
            } catch (error) {
                console.error("IMDB Error:", error);
                setError("Something went wrong while loading movies.");
            } finally {
                setLoading(false);
            }
        };

        fetchPopularMovies();
        fetchNowPlayingMovies();
        fetchUpcomingMovies();
        fetchTopRatedMovies();
    }, [token]);

    /* search TMDB */
    const handleSearch = async (event) => {
        event.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        setError("");

         try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          searchTerm
        )}&include_adult=false&language=en-US&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Could not search for movies.");
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
        console.error("TMDB Search Error:", error);
        setError("Something went wrong while searching for movies.");
    } finally {
        setSearching(false);
    }
    };

/* Reusable movie card */
const renderMovieCard = (movie) => (
    <div className="movie-card" key={movie.id}>
        {movie.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`${movie.title} poster`}/>
        ) : (
            <div className="no-poster">No poster available</div>
        )}
            <div className="movie-card-info">
                <h3>{movie.title}</h3>

                <p>{movie.release_date
                ? movie.release_date.substring(0, 4)
                : "Release date unavailable"}</p>

                <p>⭐ {movie.vote_average?.toFixed(1) || "N/A"}</p>
            </div>
    </div>
);

    return (
        <main className="movies-page">
            {/* search area */}
            <section className="movie-search-section">
                <h1>Find Your Next Movie</h1>
                <p>Search for a movie or browse what's popular.</p>
                <form className="movie-search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by movie title..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}/>
                    <button type="submit">
                        <span className="material-symbols-rounded">search</span>
                        Search
                    </button>
                </form>
            </section>

            {error && <p className="movies-error">{error}</p>}

            {/* search results */}
            {searchResults.length > 0 && (
                <section className="movie-section">
                    <h2>Search Results</h2>
                    <div className="movie-grid">
                        {searchResults.map(renderMovieCard)}
                    </div>
                </section>
            )}

            {searching && <p>Searching movies...</p>}

{/* Popular Movies and Now Playing */}
{!searching && searchResults.length === 0 && (
  <>
    <section className="movie-section">
      <h2>Popular Movies</h2>

      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="movie-grid">
          {popularMovies.map(renderMovieCard)}
        </div>
      )}
    </section>

    <section className="movie-section">
      <h2>Now Playing</h2>

      <div className="movie-grid">
        {nowPlayingMovies.map(renderMovieCard)}
      </div>
    </section>

    <section className="movie-section">
        <h2>Coming Soon</h2>

        <div className="movie-grid">
            {upcomingMovies.map(renderMovieCard)}
        </div>
    </section>

    <section className="movie-section">
        <h2>Top Rated</h2>

        <div className="movie-grid">
            {topRatedMovies.map(renderMovieCard)}
        </div>
    </section>
  </>
)}
        </main>
    );
}

export default Movies;
