import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const filterWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.user_details.already_watched);
};

export const filterDueMovies = (movies, dateFrom, dateTo) => {
  return movies.filter((movie) => {
    if (
      dayjs(movie.user_details.watching_date).isSame(dateFrom) ||
      dayjs(movie.user_details.watching_date).isBetween(dateFrom, dateTo) ||
      dayjs(movie.user_details.watching_date).isSame(dateTo)
    ) {
      console.log('true');
      return true;
    } else {
      return false;
    }
  });
};

export const countWatchedMoviesInDateRange = (movies) => {
  return movies.length;
};


export const countWatchedMoviesDuration = (movies) => {
  const reducer = (counter, currentValue) => counter + currentValue.duration;

  return movies.reduce(reducer, 0);
};

export const genres = (movies) => {
  const genres = {};

  movies.forEach((movie) => {
    movie.genres.forEach((genre) => {
      if (genre in genres) {
        genres[genre]++;
      } else {
        genres[genre] = 1;
      }
    });
  });

  return genres;
};

export const mostLikelyGenre = (genres) => {
  let biggestCount = -1;
  let biggestGenre = '';

  for (const [key, value] of Object.entries(genres)) {
    if (value > biggestCount) {
      biggestGenre = key;
      biggestCount = value;
    }
  }

  return biggestGenre;
};

export const genresArray = (genres) => {
  const genresPair = [];

  for (const [key, value] of Object.entries(genres)) {
    genresPair.push({
      title: key,
      count: value,
    });
  }

  genresPair.sort((a, b) => b.count - a.count);

  return genresPair;
};

export const genresArrayTitle = (genres) => {
  const genresPair = genresArray(genres);

  const genresTitles = [];

  genresPair.forEach((element) => {
    genresTitles.push(element.title);
  });

  return genresTitles;
};

export const genresArrayCount = (genres) => {
  const genresPair = genresArray(genres);

  const genresCounts = [];

  genresPair.forEach((element) => {
    genresCounts.push(element.count);
  });

  return genresCounts;
};

