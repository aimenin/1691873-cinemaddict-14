import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._movie = Object.assign(
      {},
      this._movie,
      update,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const scrollPosition = this.getElement().scrollHeight;
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    newElement.scrollTo(0, scrollPosition);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restorHandlers');
  }
}
