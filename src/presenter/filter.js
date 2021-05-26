import {FilterType, UpdateType, MenuItem} from '../const';
import {filter} from '../utils/filter.js';
import {render, RenderPosition, remove, replace} from '../utils/render';
import MainMenuView from '../view/main-menu';

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel, menuFunction) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._menuFunction = menuFunction;

    this._mainMenuComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._mainMenuComponent;

    this._mainMenuComponent = new MainMenuView(filters, this._filterModel.getFilter());
    this._mainMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._mainMenuComponent.setStatsClickHandler(this._menuFunction);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._mainMenuComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._mainMenuComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter().activeFilter === filterType && this._filterModel.getFilter().activeMenuPoint !== MenuItem.STATISTIC) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType, MenuItem.MOVIES);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'Already watched',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  destroy() {
    remove(this._filmCartComponent);
  }
}
