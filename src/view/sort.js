import AbstractView from './abstract';
import {SortType} from '../const';

const createSortTemplate = (sortType) => {
  return `<ul class="sort">
  <li><a href="#" class="sort__button ${sortType === SortType.DEFAULT ? 'sort__button--active' : null}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button ${sortType === SortType.DATE ? 'sort__button--active' : null}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button ${sortType === SortType.RATING ? 'sort__button--active' : null}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends AbstractView {
  constructor(sortType) {
    super();

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
    this.getElement().addEventListener('click', this._sortTypeChangeHadler);
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }
}
