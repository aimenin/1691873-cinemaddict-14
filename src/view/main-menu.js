import AbstractView from './abstract';
import {SortType} from '../const';

const createMainMenuTemplate = (filters, sortType) => {
  const {watchlist, history, favorites} = filters;

  return `<div><nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist.length}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history.length}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites.length}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>

  <ul class="sort">
  <li><a href="#" class="sort__button ${sortType === SortType.DEFAULT ? 'sort__button--active' : null}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button ${sortType === SortType.DATE ? 'sort__button--active' : null}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button ${sortType === SortType.RATING ? 'sort__button--active' : null}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul></div>`;
};

export default class MainMenu extends AbstractView {
  constructor(filters, sortType) {
    super();

    this._filters = filters;
    this._sortType = sortType;

    this._sortTypeChangeHadler = this._sortTypeChangeHadler.bind(this);
  }

  _sortTypeChangeHadler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().querySelector('.sort').addEventListener('click', this._sortTypeChangeHadler);
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters, this._sortType);
  }
}
