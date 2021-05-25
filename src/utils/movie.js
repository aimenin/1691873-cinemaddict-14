import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(objectSupport);
dayjs.extend(relativeTime);

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

  if (numberOfWatchlist > 10 && numberOfWatchlist <= 20) {
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

export const sortDate = (movieA, movieB) => {
  return dayjs(movieB.releaseTime).diff(dayjs(movieA.releaseTime));
};

export const sortRating = (movieA, movieB) => {
  return movieB.rating - movieA.rating;
};

export const durationParse = (duration) => {
  return dayjs({minute: duration}).format('h[h] mm[m]');
};

export const releaseTimeParse = (releaseTime) => {
  return dayjs(releaseTime).format('DD-MMMM-YYYY');
};

export const generateHumanizeCommentDate = (date) => {
  return dayjs().to(dayjs(date));
};
