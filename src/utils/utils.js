// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
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

