import PopupExtraMoviesView from '../view/film-details';
import FilmCartView from '../view/film-cart';
import { render, RenderPosition, remove, replace } from '../utils/render';
import { clipDescription } from '../utils/movie';

const Mode = {
  CART: 'CART',
  POPUP: 'POPUP',
};

export default class Movie {
  constructor(movieListContainer, changeData, changeMode) {
    this._movieListContainer = movieListContainer;
    this._changeData = changeData;
    this._changePopup = {};
    this.mode = Mode.CART;
    this._changeMode = changeMode;

    this._popupComponent = null;
    this._filmCartComponent = null;

    this._cardClick = this._cardClick.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchListPopupClick = this._handleWatchListPopupClick.bind(this);
    this._handleAlreadyWatchedPopupClick = this._handleAlreadyWatchedPopupClick.bind(this);
    this._handleFavoritePopupClick = this._handleFavoritePopupClick.bind(this);
    this._openPopup = this._openPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(movie) {
    this._movie = movie;

    const prevCartFilmComponent = this._filmCartComponent;
    const prevCartPopupComponent = this._popupComponent;

    const description = clipDescription(movie.description);

    this._filmCartComponent = new FilmCartView(movie, description);
    this._popupComponent = new PopupExtraMoviesView(movie);

    this._filmCartComponent.setClickHandler(() => {
      this._cardClick(movie);
    });

    this._filmCartComponent.setWatchListHandler(this._handleWatchListClick);
    this._filmCartComponent.setAlreadyWatchedHandler(this._handleAlreadyWatchedClick);
    this._filmCartComponent.setFavoriteHandler(this._handleFavoriteClick);

    if (prevCartFilmComponent === null || prevCartPopupComponent == null) {
      render(this._movieListContainer, this._filmCartComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.mode == Mode.CART) {
      replace(this._filmCartComponent, prevCartFilmComponent);
    }

    if (this.mode == Mode.POPUP) {
      replace(this._filmCartComponent, prevCartFilmComponent);
      remove(this._popupComponent);
    }

    remove(prevCartPopupComponent);
    remove(prevCartFilmComponent);
  }

  resetView() {
    if (this.mode !== Mode.CART) {
      this._closePopup();
    }
  }

  _openPopup(movie) {
    document.body.classList.add('hide-overflow');
    this._changePopup = {
      watchlist: movie.user_details.watchlist,
      already_watched: movie.user_details.already_watched,
      favorite: movie.user_details.favorite,
    };
    this._popupComponent.setWatchListHandler(this._handleWatchListPopupClick);
    this._popupComponent.setAlreadyWatchedHandler(this._handleAlreadyWatchedPopupClick);
    this._popupComponent.setFavoriteHandler(this._handleFavoritePopupClick);
    this._changeMode();
    document.body.appendChild(this._popupComponent.getElement());
    this.mode = Mode.POPUP;
  }

  _closePopup() {
    if (this._popupComponent.getElement().parentNode && document.body.contains(this._popupComponent.getElement())) {
      document.body.removeChild(this._popupComponent.getElement());
    }
    this._changeData(Object.assign(
      {},
      this._movie,
      {
        user_details: {
          ...this._changePopup,
        },
      },
    ));
    this.mode = Mode.CART;
    document.body.classList.remove('hide-overflow');
  }

  _cardClick(movie) {
    this._popupComponent = new PopupExtraMoviesView(movie);

    const onEscKeyDown = (e) => {
      if (e.key == 'Escape' || e.key == 'Esc') {
        e.preventDefault();
        this._closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    this._openPopup(movie);

    document.addEventListener('keydown', onEscKeyDown);

    this._popupComponent.setCloseClickHandler(() => {
      this._closePopup(this._popupComponent.getElement());
      document.removeEventListener('keydown', onEscKeyDown);
    });
  }

  _handleWatchListPopupClick() {
    this._changePopup = Object.assign(
      {},
      this._changePopup,
      {
        watchlist: !this._changePopup.watchlist,
      },
    );
  }

  _handleAlreadyWatchedPopupClick() {
    this._changePopup = Object.assign(
      {},
      this._changePopup,
      {
        already_watched: !this._changePopup.already_watched,
      },
    );
  }

  _handleFavoritePopupClick() {
    this._changePopup = Object.assign(
      {},
      this._changePopup,
      {
        favorite: !this._changePopup.favorite,
      },
    );
  }

  _handleWatchListClick() {
    this._changeData(Object.assign(
      {},
      this._movie,
      {
        user_details: {
          ...this._movie.user_details,
          watchlist: !this._movie.user_details.watchlist,
        },
      },
    ));
  }

  _handleAlreadyWatchedClick() {
    this._changeData(Object.assign(
      {},
      this._movie,
      {
        user_details: {
          ...this._movie.user_details,
          already_watched: !this._movie.user_details.already_watched,
        },
      },
    ));
  }

  _handleFavoriteClick() {
    this._changeData(Object.assign(
      {},
      this._movie,
      {
        user_details: {
          ...this._movie.user_details,
          favorite: !this._movie.user_details.favorite,
        },
      },
    ));
  }

  destroy() {
    remove(this._filmCartComponent);
  }
}
