import AbstractView from './abstract';
import {durationParse, generateRatingColor} from '../utils/movie';
import dayjs from 'dayjs';

// шаблон для карточки фильма
const createFilmCartTemplate = (movie, description) => {
  const {name, rating, duration, genres, posterUrl, comments, user_details, releaseTime} = movie;
  const parsedDuration = durationParse(duration);
  const year = dayjs(releaseTime).format('YYYY');
  const ratingColor = generateRatingColor(rating);

  return `<article class="film-card">
  <h3 class="film-card__title">${name}</h3>
  <p class="film-card__rating film-card__rating--${ratingColor}">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${year}</span>
    <span class="film-card__duration">${parsedDuration}</span>
    <span class="film-card__genre">${genres[0]}</span>
  </p>
  <img src="${posterUrl}" alt="" class="film-card__poster">
  <p class="film-card__description">${description}</p>
  <a class="film-card__comments">${comments.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${user_details.watchlist ? 'film-card__controls-item--active' : null}" type="button" data-type="watchlist">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${user_details.already_watched ? 'film-card__controls-item--active' : null}" type="button" data-type="alreadyWatched">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${user_details.favorite ? 'film-card__controls-item--active' : null}" type="button" data-type="favorite">Mark as favorite</button>
  </div>
  </article>`;
};

export default class FilmCart extends AbstractView {
  constructor(movie, description) {
    super();

    this._movie = movie;
    this._description = description;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCartTemplate(this._movie, this._description);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    if (['film-card__poster', 'film-card__title', 'film-card__comments'].includes(evt.target.className)) {
      this._callback.click();
    }

    if (['watchlist'].includes(evt.target.dataset.type)) {
      this._callback.watchListClick();
    }

    if (['alreadyWatched'].includes(evt.target.dataset.type)) {
      this._callback.alreadyWatched();
    }

    if (['favorite'].includes(evt.target.dataset.type)) {
      this._callback.favorite();
    }
  }

  setWatchListHandler(callback) {
    this._callback.watchListClick = callback;

    this.getElement().addEventListener('click', this._clickHandler);
  }

  setAlreadyWatchedHandler(callback) {
    this._callback.alreadyWatched = callback;

    this.getElement().addEventListener('click', this._clickHandler);
  }

  setFavoriteHandler(callback) {
    this._callback.favorite = callback;

    this.getElement().addEventListener('click', this._clickHandler);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener('click', this._clickHandler);
  }
}
