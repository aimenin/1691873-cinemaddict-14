import {createElement} from '../utils/utils';

// шаблон для экстра блока(самые просматриваемые, самые прокаменчиные)
const createFilmsListExtraTemplate = (blockName) => {
  return `<section class="films-list films-list--extra">
  <h2 class="films-list__title">${blockName}</h2>

  <div class="films-list__container">
  </section>`;
};

export default class FilmsListExtra {
  constructor(blockName) {
    this._element = null;

    this._blockName = blockName;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._blockName);
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
