import Smart from './smart';
import {durationParse, generateHumanizeCommentDate} from '../utils/movie';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {emotions} from '../const';
import he from 'he';

const emojies = {
  SMILE: 'emoji-smile',
  SLEEPING: 'emoji-sleeping',
  PUKE: 'emoji-puke',
  ANGRY: 'emoji-angry',
};

const localComment = {
  comment: '',
  emotionImg: '',
  localCommentId: '',
  emotion: '',
};

const emotionImage = {
  smile: '<img src="./images/emoji/smile.png" width="55" height="55" alt="emoji-smile">',
  sleeping: '<img src="./images/emoji/sleeping.png" width="55" height="55" alt="emoji-sleeping">',
  puke: '<img src="./images/emoji/puke.png" width="55" height="55" alt="emoji-puke">',
  angry: '<img src="./images/emoji/angry.png" width="55" height="55" alt="emoji-angry">',
};

const createFilmDetailsTemplate = (movie, comments) => {
  const {name, posterUrl, ageRating, originalName, rating, director, writers, actors, duration, releaseTime, countries, genres, description, user_details, comment} = movie;
  const parsedDuration = durationParse(duration);
  const parsedReleaseTime = dayjs(releaseTime).format('DD-MMMM-YYYY');

  const writersString = writers.join(', ');
  const actorsString = actors.join(', ');

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${posterUrl}" alt="">
  
            <p class="film-details__age">${ageRating}</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${name}</h3>
                <p class="film-details__title-original">Original: ${originalName}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writersString}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actorsString}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${parsedReleaseTime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${parsedDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${countries.length > 1 ? 'Countries' : 'Country'}</td>
                ${countries.map((element) => { return `<td class="film-details__cell">${element}</td>`;}).join('')}
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">
                  ${genres.map((element) => { return `<span class="film-details__genre">${element}</span>`; }).join('')}
              </tr>
            </table>
  
            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>
  
        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${user_details.watchlist ? 'checked' : null}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist" data-type='watchlist'>Add to watchlist</label>
  
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${user_details.already_watched ? 'checked' : null}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched" data-type='alreadyWatched'>Already watched</label>
  
          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${user_details.favorite ? 'checked' : null}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite" data-type='favorite'>Add to favorites</label>
        </section>
      </div>
  
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
  
          <ul class="film-details__comments-list">
            ${comments.map((comment) => {
    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                ${emotionImage[comment.emotion]}
              </span>
              <div>
                <p class="film-details__comment-text">${comment.comment}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${comment.authorName}</span>
                  <span class="film-details__comment-day">${generateHumanizeCommentDate(comment.date)}</span>
                  <button class="film-details__comment-delete" id=${comment.id}>Delete</button>
                </p>
              </div>
            </li>`;
  }).join('')}
          </ul>
  
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${movie.emotionImg}</div>
  
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(comment)}</textarea>
            </label>
  
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${movie.emotion == emojies.SMILE ? 'checked' : null}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji" data-emoji="${emojies.SMILE}">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${movie.emotion == emojies.SLEEPING ? 'checked' : null}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji" data-emoji="${emojies.SLEEPING}">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${movie.emotion == emojies.PUKE ? 'checked' : null}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji" data-emoji="${emojies.PUKE}">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${movie.emotion == emojies.ANGRY ? 'checked' : null}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji" data-emoji="${emojies.ANGRY}">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetails extends Smart {
  constructor(movie, comments) {
    super();

    this._movie = FilmDetails.parseMovieToData(movie);
    this._comments = comments;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._clickControl = this._clickControl.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._inputCommentHandler = this._inputCommentHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._emotionImg = null;

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._movie, this._comments);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _clickControl(evt) {
    if (['watchlist'].includes(evt.target.dataset.type)) {
      this._callback.watchlist();
    }

    if (['alreadyWatched'].includes(evt.target.dataset.type)) {
      this._callback.alreadyWatched();
    }

    if (['favorite'].includes(evt.target.dataset.type)) {
      this._callback.favorite();
    }
  }

  setWatchListHandler(callback) {
    this._callback.watchlist = callback;
    this.getElement().querySelector('.film-details__controls').addEventListener('click', this._clickControl);
  }

  setAlreadyWatchedHandler(callback) {
    this._callback.alreadyWatched = callback;

    this.getElement().querySelector('.film-details__controls').addEventListener('click', this._clickControl);
  }

  setFavoriteHandler(callback) {
    this._callback.favorite = callback;

    this.getElement().querySelector('.film-details__controls').addEventListener('click', this._clickControl);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  setDeleteCommentHadler(callback) {
    this._callback.deleteClick = callback;
    Array.from(this.getElement().querySelectorAll('.film-details__comment-delete'))
      .forEach((deleteButton) => deleteButton.addEventListener('click', this._deleteClickHandler));
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    document.addEventListener('keydown', this._submitHandler);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiClickHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._inputCommentHandler);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(evt.target.id);
    const comment = this._comments.find((comment) => comment.id === evt.target.id);
    this.updateComments(comment);
  }

  _submitHandler(evt) {
    if (evt.ctrlKey && evt.key == 'Enter') {
      this.updateData({
        localCommentId: nanoid(),
      }, true);
      this.addComment(FilmDetails.parseMovieToLocalComment(this._movie), true);
      this._callback.submit(FilmDetails.parseMovieToLocalComment(this._movie));
      this.updateData({
        comment: '',
        emotion: '',
        emotionImg: '',
      });
    }
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    switch(evt.target.dataset.emoji) {
      case emojies.ANGRY:
        this.updateData({
          emotionImg: emotionImage.angry,
          emotion: emotions.ANGRY,
        });
        break;
      case emojies.PUKE:
        this.updateData({
          emotionImg: emotionImage.puke,
          emotion: emotions.PUKE,
        });
        break;
      case emojies.SLEEPING:
        this.updateData({
          emotionImg: emotionImage.sleeping,
          emotion: emotions.SLEEPING,
        });
        break;
      case emojies.SMILE:
        this.updateData({
          emotionImg: emotionImage.smile,
          emotion: emotions.SMILE,
        });
        break;
    }
  }

  _inputCommentHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  static parseMovieToData(movie) {
    return Object.assign(
      {},
      movie,
      localComment,
    );
  }

  static parseMovieToLocalComment(movie) {
    return {
      id: movie.localCommentId,
      comment: movie.comment,
      emotion: movie.emotion,
    };
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setWatchListHandler(this._callback.watchlist);
    this.setAlreadyWatchedHandler(this._callback.alreadyWatched);
    this.setCloseClickHandler(this._callback.closeClick);
    this.setFavoriteHandler(this._callback.favorite);
    this.setDeleteCommentHadler(this._callback.deleteClick);
    this.setSubmitHandler(this._callback.submit);
  }
}
