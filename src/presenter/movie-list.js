import MainMenuView from '../view/main-menu';
import FilmsListExtraView from '../view/films-list-extra';
import NoMoviesView from '../view/no-movies';
import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import ButtonShowMore from '../view/button-show-more';
import MoviePresenter from './movie';
import { generateFilters, getMostCommentedMovies, getTopRatedMovies } from '../utils/movie';
import {render, RenderPosition, remove} from '../utils/render';
import {updateItem} from '../utils/common';

const EXTRA_COUNT = 2;
const MOVIES_PER_STEP = 5;

const types = {
  MAIN_LIST: 'MAIN_LIST',
  EXTRA_LIST: 'EXTRA_LIST',
};

export default class MovieList {
  constructor(movieListComponent) {
    this._movieListContainer = movieListComponent;

    this._noMoviesComponent = new NoMoviesView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._loadMoreButton = null;

    this._mainCount = MOVIES_PER_STEP;
    this._filmCartPresenter = {};

    this._handleMovieCartChange = this._handleMovieCartChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();

    render(this._movieListContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderMovieList();
  }

  _renderMainMenu() {
    const filters = generateFilters(this._movies);

    const mainMenuComponent = new MainMenuView(filters);

    render(this._movieListContainer, mainMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoMovies() {
    render(this._filmsComponent, this._noMoviesComponent(), RenderPosition.BEFOREEND);
  }

  _renderLoadMoreButton(container) {
    this._loadMoreButton = new ButtonShowMore();

    render(this._filmsListComponent, this._loadMoreButton, RenderPosition.BEFOREEND);

    this._loadMoreButton.setClickHandler(() => {
      this._movies
        .slice(this._mainCount, this._mainCount + MOVIES_PER_STEP)
        .forEach((movie) => this._renderMovie(container, movie));

      this._mainCount += MOVIES_PER_STEP;

      if (this._movies.length <= this._mainCount) {
        remove(this._loadMoreButton);
      }
    });
  }

  _renderFilmsList() {
    const filmsListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');

    this._renderMovies(0, Math.min(this._movies.length, MOVIES_PER_STEP), filmsListContainerElement);

    if (this._movies.length > MOVIES_PER_STEP) {
      this._renderLoadMoreButton(filmsListContainerElement);
    }
  }

  _renderMovie(container, movie) {
    const moviePresenter = new MoviePresenter(container, this._handleMovieCartChange, this._handleModeChange);
    moviePresenter.init(movie);
    if (movie.id in this._filmCartPresenter) {
      this._filmCartPresenter[movie.id].push(moviePresenter);
    } else {
      this._filmCartPresenter[movie.id] = [moviePresenter];
    }
  }

  _clearMoviesList(type) {
    Object
      .values(this._filmCartPresenter)
      .forEach((presenter) => presenter.forEach((presenterItem) => presenterItem.destroy()));
    this._filmCartPresenter = {};

    if (type == types.MAIN_LIST) {
      this._mainCount = MOVIES_PER_STEP;
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderMovies(from, to, container) {
    this._movies
      .slice(from, to)
      .forEach((movie) => this._renderMovie(container, movie));
  }

  _handleModeChange() {
    Object
      .values(this._filmCartPresenter)
      .forEach((presenterArray) => {
        presenterArray.forEach((presenter) => {
          presenter.resetView();
        });
      });
  }

  _handleMovieCartChange(updatedMovie) {
    this._movies = updateItem(this._movies, updatedMovie);
    this._filmCartPresenter[updatedMovie.id].forEach((presenter) => {
      presenter.init(updatedMovie);
    });
  }

  _renderExtraBlocks() {
    if (this._movies.length !== 0) {
      const topRatedElement = new FilmsListExtraView('Top Rated');
      const mostCommentedElement = new FilmsListExtraView('Most Commented');

      render(this._filmsComponent, topRatedElement, RenderPosition.BEFOREEND);
      render(this._filmsComponent, mostCommentedElement, RenderPosition.BEFOREEND);

      const topRatedListFilmsElement = topRatedElement.getElement().querySelector('.films-list__container');
      const mostCommentedListFilmsElement = mostCommentedElement.getElement().querySelector('.films-list__container');

      const topRatedMovies = getTopRatedMovies(this._movies);
      const mostCommentedMovies = getMostCommentedMovies(this._movies);

      for (let i = 0; i < EXTRA_COUNT; i++) {
        this._renderMovie(topRatedListFilmsElement, topRatedMovies[i]);
      }

      for (let i = 0; i < EXTRA_COUNT; i++) {
        this._renderMovie(mostCommentedListFilmsElement, mostCommentedMovies[i]);
      }
    }
  }

  _renderMovieList() {
    if (this._movies.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderMainMenu();
    this._renderFilmsList();
    this._renderExtraBlocks();
  }
}
