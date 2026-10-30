import { useState, useEffect } from "react";
import "./StreamList.css";

function StreamList() {
    const [item, setItem] = useState("");
    const [list, setList] = useState(() => {
        const savedList = localStorage.getItem("streamList");
        return savedList ? JSON.parse(savedList) : [];
    });
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        localStorage.setItem("streamList", JSON.stringify(list));
    }, [list]);

    // Add a new movie or show
    const handleSubmit = (e) => {
        e.preventDefault();

        if (item.trim() === "") return;

        const newMovie = {
            id: Date.now(),
            title: item.trim(),
            watched: false,
            rating: null
        };

        setList((previousList) => [...previousList, newMovie]);
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

    // Display either the movie title or the editing form
    const renderMovieTitle = (movie) => {
        if (editingId === movie.id) {
            return (
                <div className="edit-form">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        aria-label={`Edit ${movie.title}`}
                    />

                    <button
                        type="button"
                        className="icon-btn save-btn"
                        onClick={() => handleSaveEdit(movie.id)}
                        title="Save changes"
                        aria-label="Save changes"
                    >
                        <span className="material-symbols-rounded">
                            save
                        </span>
                    </button>

                    <button
                        type="button"
                        className="icon-btn cancel-btn"
                        onClick={handleCancelEdit}
                        title="Cancel editing"
                        aria-label="Cancel editing"
                    >
                        <span className="material-symbols-rounded">
                            close
                        </span>
                    </button>
                </div>
            );
        }

        return <p className="movie-title">{movie.title}</p>;
    };

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
                        <div
                            key={movie.id}
                            className="card streamlist-card"
                        >
                            <div className="movie-information">
                                {renderMovieTitle(movie)}
                            </div>

                            {editingId !== movie.id && (
                                <div className="movie-actions">

                                    {/* Mark movie watched */}
                                    <button
                                        type="button"
                                        className="action-btn watched-btn"
                                        onClick={() =>
                                            handleToggleWatched(movie.id)
                                        }
                                        title="Mark as watched"
                                    >
                                        <span className="material-symbols-rounded">
                                            visibility
                                        </span>
                                        Watched
                                    </button>

                                    {/* Edit */}
                                    <button
                                        type="button"
                                        className="icon-btn edit-btn"
                                        onClick={() =>
                                            handleStartEdit(movie)
                                        }
                                        title="Edit movie"
                                        aria-label={`Edit ${movie.title}`}
                                    >
                                        <span className="material-symbols-rounded">
                                            edit
                                        </span>
                                    </button>

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        className="icon-btn delete-btn"
                                        onClick={() =>
                                            handleDelete(movie.id)
                                        }
                                        title="Delete movie"
                                        aria-label={`Delete ${movie.title}`}
                                    >
                                        <span className="material-symbols-rounded">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
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
                        <div
                            key={movie.id}
                            className="card streamlist-card watched-card"
                        >
                            <div className="movie-information">
                                {renderMovieTitle(movie)}

                                {editingId !== movie.id && (
                                    <div
                                        className="rating-form"
                                        role="group"
                                        aria-label={`Rate ${movie.title}`}
                                    >
                                        <span className="rating-question">
                                            Did you like it?
                                        </span>

                                        {/* Like */}
                                        <button
                                            type="button"
                                            className={
                                                movie.rating === "liked"
                                                    ? "rating-btn liked selected"
                                                    : "rating-btn liked"
                                            }
                                            onClick={() =>
                                                handleRating(
                                                    movie.id,
                                                    "liked"
                                                )
                                            }
                                            title="I liked this movie"
                                            aria-label={`Like ${movie.title}`}
                                            aria-pressed={
                                                movie.rating === "liked"
                                            }
                                        >
                                            <span className="material-symbols-rounded">
                                                sentiment_satisfied
                                            </span>
                                            Like
                                        </button>

                                        {/* Dislike */}
                                        <button
                                            type="button"
                                            className={
                                                movie.rating === "disliked"
                                                    ? "rating-btn disliked selected"
                                                    : "rating-btn disliked"
                                            }
                                            onClick={() =>
                                                handleRating(
                                                    movie.id,
                                                    "disliked"
                                                )
                                            }
                                            title="I did not like this movie"
                                            aria-label={`Dislike ${movie.title}`}
                                            aria-pressed={
                                                movie.rating === "disliked"
                                            }
                                        >
                                            <span className="material-symbols-rounded">
                                                sentiment_dissatisfied
                                            </span>
                                            Dislike
                                        </button>
                                    </div>
                                )}
                            </div>

                            {editingId !== movie.id && (
                                <div className="movie-actions">

                                    {/* Move back */}
                                    <button
                                        type="button"
                                        className="action-btn move-back-btn"
                                        onClick={() =>
                                            handleToggleWatched(movie.id)
                                        }
                                        title="Move back to Want to Watch"
                                    >
                                        <span className="material-symbols-rounded">
                                            undo
                                        </span>
                                        Move Back
                                    </button>

                                    {/* Edit */}
                                    <button
                                        type="button"
                                        className="icon-btn edit-btn"
                                        onClick={() =>
                                            handleStartEdit(movie)
                                        }
                                        title="Edit movie"
                                        aria-label={`Edit ${movie.title}`}
                                    >
                                        <span className="material-symbols-rounded">
                                            edit
                                        </span>
                                    </button>

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        className="icon-btn delete-btn"
                                        onClick={() =>
                                            handleDelete(movie.id)
                                        }
                                        title="Delete movie"
                                        aria-label={`Delete ${movie.title}`}
                                    >
                                        <span className="material-symbols-rounded">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default StreamList;
