import AbstractView from './abstract';

// шаблон отображает количество фильмов
const createFooterStatisticTemplate = (amount) => {
  return `<p>${amount} movies inside</p>`;
};

export default class FooterStatistic extends AbstractView {
  constructor(amount) {
    super();

    this._amount = amount;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._amount);
  }
}
