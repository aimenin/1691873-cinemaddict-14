import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  deleteComment(update, justDataUpdating) {
    if (!update) {
      return;
    }

    const index = this._comments.findIndex((comment) => comment.id === update.id);

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateComment(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._comments = update.slice();

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
