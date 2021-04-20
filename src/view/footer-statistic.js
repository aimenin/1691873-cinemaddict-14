import {createElement} from '../utils/utils';

// шаблон отображает количество фильмов
const createFooterStatisticTemplate = (amount) => {
  return `<p>${amount} movies inside</p>`;
};

export default class FooterStatistic {
  constructor(amount) {
    this._element = null;

    this._amount = amount;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._amount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
