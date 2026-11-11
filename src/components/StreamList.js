import { useState, useEffect } from "react";
import "./StreamList.css";
import MovieCard from "./MovieCard";

function StreamList() {
    const [item, setItem] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const token = process.env.REACT_APP_TMDB_TOKEN;

    const [list, setList] = useState(() => {
        const savedList = localStorage.getItem("streamList");
        if (!savedList) return [];
        try {
            return JSON.parse(savedList);
        } catch (error) {
            console.error("Corrupted streamList in localStorage, resetting:", error);
            localStorage.removeItem("streamList");
            return [];
        }
    });
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        localStorage.setItem("streamList", JSON.stringify(list));
    }, [list]);

    // Add a new movie or show
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (item.trim() === "") return;

        if (!token) {
            console.error("TMDB token is missing. Set REACT_APP_TMDB_TOKEN in your .env file.");
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(item)}&include_adult=false&language=en-US&page=1`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error("Could not search for movies.");
                }
                setSearchResults(data.results || []);
                } catch (error) {
                    console.error("TMDB Search Error:", error);
                    setSearchResults([]);
                } finally {
                    setSearching(false);
                }
    };

    const addMovieFromSearch = (movie) => {
        const alreadyExists = list.some((m) => m.id === movie.id);
        if (alreadyExists) {
            alert("This movie is already in your StreamList.");
            return;
        }
        const movieToAdd = {
            id: movie.id,
            title: movie.title || movie.name,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            watched: false,
            rating: null
        };
        setList((previousList) => [...previousList, movieToAdd]);

        setSearchResults([]);
        setItem("");
    };

    // Delete a movie
    const handleDelete = (id) => {
        setList((previousList) =>
            previousList.filter((movie) => movie.id !== id)
        );
    };

    // Move a movie between Want to Watch and Already Watched
    const handleToggleWatched = (id) => {
        setList((previousList) =>
            previousList.map((movie) =>
                movie.id === id
                    ? { ...movie, watched: !movie.watched }
                    : movie
            )
        );
    };

    // Like or dislike a watched movie
    const handleRating = (id, rating) => {
        setList((previousList) =>
            previousList.map((movie) =>
                movie.id === id
                    ? { ...movie, rating: rating }
                    : movie
            )
        );
    };

    // Begin editing a movie
    const handleStartEdit = (movie) => {
        setEditingId(movie.id);
        setEditText(movie.title);
    };

    // Save edited movie title
    const handleSaveEdit = (id) => {
        if (editText.trim() === "") return;

        setList((previousList) =>
            previousList.map((movie) =>
                movie.id === id
                    ? { ...movie, title: editText.trim() }
                    : movie
            )
        );

        setEditingId(null);
        setEditText("");
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText("");
    };

    // Separate movies based on watched status
    const moviesToWatch = list.filter((movie) => !movie.watched);
    const watchedMovies = list.filter((movie) => movie.watched);



    return (
        <div className="container streamlist-container">
            <h1 className="page-title">Your StreamList</h1>

            {/* Add movie form */}
            <form
                className="streamlist-form"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="Add a movie or show..."
                    aria-label="Movie or show title"
                />

                <button
                    type="submit"
                    className="add-btn"
                    title="Add to StreamList"
                    aria-label="Add to StreamList"
                >
                    <span className="material-symbols-rounded">
                        add
                    </span>
                    Add
                </button>
            </form>

            {searching && (
                <p className="searching-text">
                    Searching for "{item}"...
                </p>
            )}

            {searchResults.length > 0 && (
    <div className="search-results">
        {searchResults.slice(0, 5).map((movie) => (
            <div
                key={movie.id}
                className="search-result-item"
            >
                {movie.poster_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={`${movie.title} poster`}
                        className="search-result-poster"
                    />
                )}

                <div className="search-result-info">
                    <p>{movie.title}</p>

                    {movie.release_date && (
                        <span>
                            {movie.release_date.substring(0, 4)}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    className="search-add-btn"
                    onClick={() => addMovieFromSearch(movie)}
                >
                    <span className="material-symbols-rounded">
                        add
                    </span>
                    Add to Watch List
                </button>
            </div>
        ))}
    </div>
)}

            {/* Want to Watch */}
            <section className="list-section">
                <h2 className="section-title">
                    Want to Watch
                </h2>

                <div className="streamlist-items">
                    {moviesToWatch.length === 0 && (
                        <p className="empty-text">
                            There are no movies waiting to be watched.
                        </p>
                    )}

                    {moviesToWatch.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            isWatched={false}
                            isEditing={editingId === movie.id}
                            editText={editText}
                            onEditTextChange={setEditText}
                            onSaveEdit={handleSaveEdit}
                            onCancelEdit={handleCancelEdit}
                            onStartEdit={handleStartEdit}
                            onDelete={handleDelete}
                            onToggleWatched={handleToggleWatched}
                            onRate={handleRating}
                        />
                    ))}
                </div>
            </section>

            {/* Already Watched */}
            <section className="list-section watched-section">
                <h2 className="section-title">
                    Already Watched
                </h2>

                <div className="streamlist-items">
                    {watchedMovies.length === 0 && (
                        <p className="empty-text">
                            Movies marked as watched will appear here.
                        </p>
                    )}

                    {watchedMovies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            isWatched={true}
                            isEditing={editingId === movie.id}
                            editText={editText}
                            onEditTextChange={setEditText}
                            onSaveEdit={handleSaveEdit}
                            onCancelEdit={handleCancelEdit}
                            onStartEdit={handleStartEdit}
                            onDelete={handleDelete}
                            onToggleWatched={handleToggleWatched}
                            onRate={handleRating}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default StreamList;
