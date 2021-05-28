import MoviesModel from '../model/movies';
import CommentsModel from '../model/comments';
import {isOnline} from '../utils/common';

const getSyncedMovies = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.movie);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._store.setItems(items);
          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getItems());

    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, MoviesModel.adaptToServer(updatedMovie));
          return updatedMovie;
        });
    }

    this._store.setItem(movie.id, MoviesModel.adaptToServer(Object.assign({}, movie)));

    return Promise.resolve(movie);
  }

  getComments(movie) {
    if (isOnline()) {
      return this._api.getComments(movie)
        .then((comments) => {
          const items = createStoreStructure(comments.map(CommentsModel.adaptToServer));
          this._store.setItems(items);
          return comments;
        });
    }

    const storeComments = Object.values(this._store.getItems());

    return Promise.resolve(storeComments.map(CommentsModel.adaptToClient));
  }

  addComment(comment, movie) {
    if (isOnline()) {
      return this._api.addComment(comment, movie)
        .then((newComment) => {
          this._store.setItem(newComment.id, CommentsModel.adaptToServer(newComment));
          return newComment;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment)
        .then(() => this._store.removeItem(comment));
    }
  }

  sync() {
    if (isOnline()) {
      const storeTasks = Object.values(this._store.getItems());

      return this._api.sync(storeTasks)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdTasks = getSyncedMovies(response.created);
          const updatedTasks = getSyncedMovies(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdTasks, ...updatedTasks]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
