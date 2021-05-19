import {FilterType} from '../const';


export const filter = {
  [FilterType.ALL]: (movies) => movies.filter((movie) => movie),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.user_details.favorite),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.user_details.already_watched),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.user_details.watchlist),
};
