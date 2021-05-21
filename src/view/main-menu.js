import AbstractView from './abstract';
import {FilterType, MenuItem} from '../const';

const createMainMenuTemplate = (filters, currentFilterType, menuType) => {
  const [, watchlist, history, favorites] = filters;

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item ${currentFilterType == FilterType.ALL && menuType == MenuItem.MOVIES ? 'main-navigation__item--active' : ''}" data-filter="${FilterType.ALL}">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${currentFilterType == FilterType.WATCHLIST && menuType == MenuItem.MOVIES ? 'main-navigation__item--active' : ''}" data-filter="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist.count}</span></a>
    <a href="#history" class="main-navigation__item ${currentFilterType == FilterType.HISTORY && menuType == MenuItem.MOVIES ? 'main-navigation__item--active' : ''}" data-filter="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${history.count}</span></a>
    <a href="#favorites" class="main-navigation__item ${currentFilterType == FilterType.FAVORITES && menuType == MenuItem.MOVIES ? 'main-navigation__item--active' : ''}"  data-filter="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${favorites.count}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional ${menuType == MenuItem.STATISTIC ? 'main-navigation__item--active' : ''}">Stats</a>
  </nav>`;
};

export default class MainMenu extends AbstractView {
  constructor(filters, filterModelInfo) {
    super();

    this._filters = filters;
    this._currentFilterType = filterModelInfo.activeFilter;
    this._menuType = filterModelInfo.activeMenuPoint;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters, this._currentFilterType, this._menuType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    if (this._menuType == MenuItem.STATISTIC) {
      this._callback.statsHandler(MenuItem.MOVIES);
    }

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

  _statsClickHandler(evt) {
    evt.preventDefault();

    this._menuType = MenuItem.STATISTIC;

    this._callback.statsHandler(MenuItem.STATISTIC);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._filterTypeChangeHandler);
  }

  setStatsClickHandler(callback) {
    this._callback.statsHandler = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._statsClickHandler);
  }
}
