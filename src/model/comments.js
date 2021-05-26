import Observer from '../utils/observer';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments;
  }

  getComments() {
    return this._comments;
  }

  deleteComment(updateType, update) {
    this._comments = this._comments.filter((comment) => comment.id !== update);

    this._notify(updateType, update);
  }

  addComment(updateType, update) {
    delete update.authorName;

    this._comments = Object.values(update);

    this._notify(updateType, update);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        authorName: comment.author,
      },
    );

    delete adaptedComment.author;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
    );

    delete adaptedComment.authorName;

    return adaptedComment;
  }
}
