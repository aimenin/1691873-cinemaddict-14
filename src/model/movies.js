import Observer from '../utils/observer';

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies;

    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        name: movie.film_info.title,
        originalName: movie.film_info.alternative_title,
        rating: movie.film_info.total_rating,
        posterUrl: movie.film_info.poster,
        ageRating: movie.film_info.age_rating,
        director: movie.film_info.director,
        writers: movie.film_info.writers,
        actors: movie.film_info.actors,
        releaseTime: movie.film_info.release.date,
        countries: movie.film_info.release.release_country,
        duration: movie.film_info.runtime,
        genres: movie.film_info.genre,
        description: movie.film_info.description,
      },
    );

    delete adaptedMovie.film_info;

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        film_info: {
          title: movie.name,
          alternative_title: movie.originalName,
          total_rating: movie.rating,
          poster: movie.posterUrl,
          age_rating: movie.ageRating,
          director: movie.director,
          writers: movie.writers,
          actors: movie.actors,
          release: {
            date: movie.releaseTime,
            release_country: movie.countries,
          },
          runtime: movie.duration,
          genre: movie.genres,
          description: movie.description,
        },
      },
    );

    delete adaptedMovie.name;
    delete adaptedMovie.originalName;
    delete adaptedMovie.rating;
    delete adaptedMovie.posterUrl;
    delete adaptedMovie.ageRating;
    delete adaptedMovie.director;
    delete adaptedMovie.writers;
    delete adaptedMovie.actors;
    delete adaptedMovie.releaseTime;
    delete adaptedMovie.countries;
    delete adaptedMovie.duration;
    delete adaptedMovie.genres;
    delete adaptedMovie.duration;

    return adaptedMovie;
  }
}
