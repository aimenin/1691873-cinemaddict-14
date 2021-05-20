import AbstractView from './abstract';
import {FilterType} from '../const';

const createMainMenuTemplate = (filters, currentFilterType) => {
  const [, watchlist, history, favorites] = filters;

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item ${currentFilterType == FilterType.ALL ? 'main-navigation__item--active' : null}" data-filter="${FilterType.ALL}">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${currentFilterType == FilterType.WATCHLIST ? 'main-navigation__item--active' : null}" data-filter="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist.count}</span></a>
    <a href="#history" class="main-navigation__item ${currentFilterType == FilterType.HISTORY ? 'main-navigation__item--active' : null}" data-filter="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${history.count}</span></a>
    <a href="#favorites" class="main-navigation__item ${currentFilterType == FilterType.FAVORITES ? 'main-navigation__item--active' : null}"  data-filter="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${favorites.count}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MainMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.dataset.filter == FilterType.ALL) {
      this._callback.filterTypeChange(FilterType.ALL);
    }

    if (evt.target.dataset.filter == FilterType.HISTORY) {
      this._callback.filterTypeChange(FilterType.HISTORY);
    }

    if (evt.target.dataset.filter == FilterType.WATCHLIST) {
      this._callback.filterTypeChange(FilterType.WATCHLIST);
    }

    if (evt.target.dataset.filter == FilterType.FAVORITES) {
      this._callback.filterTypeChange(FilterType.FAVORITES);
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._filterTypeChangeHandler);
  }
}
