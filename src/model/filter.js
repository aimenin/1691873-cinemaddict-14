import Observer from '../utils/observer';
import {FilterType, MenuItem} from '../const';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
    this._activeMenuPoint = MenuItem.MOVIES;
  }

  setFilter(updateType, filter, menuPoint) {
    this._activeFilter = filter;
    this._activeMenuPoint = menuPoint;
    this._notify(updateType, filter);
  }

  getFilter() {
    return {
      activeFilter: this._activeFilter,
      activeMenuPoint: this._activeMenuPoint,
    };
  }
}
