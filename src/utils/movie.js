export const generateFilters = (movies) => {
  const watchlist = movies.filter((movie) => {
    return movie.user_details.watchlist;
  });

  const history = movies.filter((movie) => {
    return movie.user_details.already_watched;
  });

  const favorites = movies.filter((movie) => {
    return movie.user_details.favorite;
  });

  const filters = {
    watchlist,
    history,
    favorites,
  };

  return filters;
};

export const clipDescription = (description) => {
  if (description.length > 140) {
    description = description.slice(0, 138) + '...';
  }

  return description;
};

export const getPersonRank = (watchlist) => {
  let rank = '';

  const numberOfWatchlist = watchlist.length;

  if (numberOfWatchlist > 1 && numberOfWatchlist <= 10) {
    rank = 'Novice';
  }

  if (numberOfWatchlist > 11 && numberOfWatchlist <= 20) {
    rank = 'Fan';
  }

  if (numberOfWatchlist > 20) {
    rank = 'Movie Buff';
  }

  return rank;
};

export const getTopRatedMovies = (movies) => {
  const topRatedMovies = [...movies];
  topRatedMovies.sort((a, b) => {
    return b.rating - a.rating;
  });
  return topRatedMovies;
};

export const getMostCommentedMovies = (movies) => {
  const mostCommentedMovies = [...movies];
  mostCommentedMovies.sort((a, b) => {
    return b.comments.length - a.comments.length;
  });
  return mostCommentedMovies;
};
