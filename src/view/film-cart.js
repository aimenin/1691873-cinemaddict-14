import AbstractView from './abstract';

// шаблон для карточки фильма
const createFilmCartTemplate = (movie, description) => {
  const {name, rating, year, duration, genres, posterUrl, comments} = movie;

  return `<article class="film-card">
  <h3 class="film-card__title">${name}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${year}</span>
    <span class="film-card__duration">${duration}</span>
    <span class="film-card__genre">${genres[0]}</span>
  </p>
  <img src="${posterUrl}" alt="" class="film-card__poster">
  <p class="film-card__description">${description}</p>
  <a class="film-card__comments">${comments.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
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

    if (!['film-card__poster', 'film-card__title', 'film-card__comments'].includes(evt.target.className)) {
      return;
    }

    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener('click', this._clickHandler);
  }
}
