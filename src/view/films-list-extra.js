import AbstractView from './abstract';

// шаблон для экстра блока(самые просматриваемые, самые прокаменчиные)
const createFilmsListExtraTemplate = (blockName) => {
  return `<section class="films-list films-list--extra">
  <h2 class="films-list__title">${blockName}</h2>

  <div class="films-list__container">
  </section>`;
};

export default class FilmsListExtra extends AbstractView {
  constructor(blockName) {
    super();

    this._blockName = blockName;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._blockName);
  }
}
