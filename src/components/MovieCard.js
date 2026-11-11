function MovieCard({
    movie,
    isWatched,
    isEditing,
    editText,
    onEditTextChange,
    onSaveEdit,
    onCancelEdit,
    onStartEdit,
    onDelete,
    onToggleWatched,
    onRate,
}) {
    // Title area: either the editing form or the movie title
    const renderTitle = () => {
        if (isEditing) {
            return (
                <div className="edit-form">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => onEditTextChange(e.target.value)}
                        aria-label={`Edit ${movie.title}`}
                    />

                    <button
                        type="button"
                        className="icon-btn save-btn"
                        onClick={() => onSaveEdit(movie.id)}
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
                        onClick={onCancelEdit}
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

    // Like / dislike controls, only shown for watched movies
    const renderRatingForm = () => {
        if (!isWatched || isEditing) return null;

        return (
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
                    onClick={() => onRate(movie.id, "liked")}
                    title="I liked this movie"
                    aria-label={`Like ${movie.title}`}
                    aria-pressed={movie.rating === "liked"}
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
                    onClick={() => onRate(movie.id, "disliked")}
                    title="I did not like this movie"
                    aria-label={`Dislike ${movie.title}`}
                    aria-pressed={movie.rating === "disliked"}
                >
                    <span className="material-symbols-rounded">
                        sentiment_dissatisfied
                    </span>
                    Dislike
                </button>
            </div>
        );
    };

    // Primary action button differs between the two sections
    const renderPrimaryAction = () => {
        if (isWatched) {
            return (
                <button
                    type="button"
                    className="action-btn move-back-btn"
                    onClick={() => onToggleWatched(movie.id)}
                    title="Move back to Want to Watch"
                >
                    <span className="material-symbols-rounded">
                        undo
                    </span>
                    Move Back
                </button>
            );
        }

        return (
            <button
                type="button"
                className="action-btn watched-btn"
                onClick={() => onToggleWatched(movie.id)}
                title="Mark as watched"
            >
                <span className="material-symbols-rounded">
                    visibility
                </span>
                Watched
            </button>
        );
    };

    return (
        <div
            className={
                isWatched
                    ? "card streamlist-card watched-card"
                    : "card streamlist-card"
            }
        >
            <div className="movie-information">
                {movie.poster_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={`${movie.title} poster`}
                        className="movie-poster"
                    />
                )}
                {renderTitle()}
                {renderRatingForm()}
            </div>

            {!isEditing && (
                <div className="movie-actions">

                    {/* Watched / Move back */}
                    {renderPrimaryAction()}

                    {/* Edit */}
                    <button
                        type="button"
                        className="icon-btn edit-btn"
                        onClick={() => onStartEdit(movie)}
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
                        onClick={() => onDelete(movie.id)}
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
    );
}

export default MovieCard;
