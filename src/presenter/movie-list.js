import SortView from '../view/sort';
import LoadingView from '../view/loading';
import FilmsListExtraView from '../view/films-list-extra';
import NoMoviesView from '../view/no-movies';
import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import ButtonShowMore from '../view/button-show-more';
import MoviePresenter from './movie';
import {getMostCommentedMovies, getTopRatedMovies, sortDate, sortRating} from '../utils/movie';
import {render, RenderPosition, remove} from '../utils/render';
import {SortType, UpdateType, MovieAction} from '../const';
import {filter} from '../utils/filter';

const EXTRA_COUNT = 2;
const MOVIES_PER_STEP = 5;

export default class MovieList {
  constructor(movieListComponent, moviesModel, filterModel, apiMovie, apiComments) {
    this._apiMovies = apiMovie;
    this._apiComments = apiComments;
    this._movieListContainer = movieListComponent;
    this._currentSortType = SortType.DEFAULT;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;

    this._noMoviesComponent = new NoMoviesView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._loadingComponent = new LoadingView();
    this._loadMoreButton = null;
    this._topRatedComponent = null;
    this._mostCommentedComponent = null;
    this._sortComponent = null;

    this._mainCount = MOVIES_PER_STEP;
    this._isLoading = true;
    this._filmCartPresenter = {};

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderMovieList();
  }

  destroy() {
    this._clearMoviesList({resetRenderedMovieCount: true, resetSortType: true});

    remove(this._filmsComponent);
    remove(this._filmsListComponent);

    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter().activeFilter;
    const movies = this._moviesModel.getMovies();
    const filteredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortDate);
      case SortType.RATING:
        return filteredMovies.sort(sortRating);
    }

    return filteredMovies;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMoviesList();
    this._renderMovieList();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._movieListContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderNoMovies() {
    render(this._filmsComponent, this._noMoviesComponent, RenderPosition.BEFOREEND);
  }

  _renderLoadMoreButton(container) {
    this._loadMoreButton = new ButtonShowMore();

    render(this._filmsListComponent, this._loadMoreButton, RenderPosition.BEFOREEND);

    this._loadMoreButton.setClickHandler(() => {
      this._getMovies()
        .slice(this._mainCount, this._mainCount + MOVIES_PER_STEP)
        .forEach((movie) => this._renderMovie(container, movie));

      this._mainCount += MOVIES_PER_STEP;

      if (this._getMovies().length <= this._mainCount) {
        remove(this._loadMoreButton);
      }
    });
  }

  _renderMovie(container, movie) {
    const moviePresenter = new MoviePresenter(container, this._handleViewAction, this._handleModeChange, this._apiComments);
    moviePresenter.init(movie);
    if (movie.id in this._filmCartPresenter) {
      this._filmCartPresenter[movie.id].push(moviePresenter);
    } else {
      this._filmCartPresenter[movie.id] = [moviePresenter];
    }
  }

  _clearMoviesList({resetRenderedMovieCount = false, resetSortType = false} = {}) {
    Object
      .values(this._filmCartPresenter)
      .forEach((presenter) => presenter.forEach((presenterItem) => presenterItem.destroy()));
    this._filmCartPresenter = {};

    if (resetRenderedMovieCount) {
      this._mainCount = MOVIES_PER_STEP;
    } else {
      this._mainCount = Math.min(this._getMovies().length, this._mainCount);
    }

    remove(this._loadMoreButton);
    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._topRatedComponent);
    remove(this._mostCommentedComponent);
    remove(this._filmsComponent);
    remove(this._filmsListComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderMovies(movies, container) {
    movies.forEach((movie) => this._renderMovie(container, movie));
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

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case MovieAction.UPDATE_MOVIE:
        this._apiMovies.updateMovie(update).then((response) => {
          this._moviesModel.updateMovie(updateType, response);
        });
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmCartPresenter[data.id].forEach((presenter) => presenter.init(data));
        break;
      case UpdateType.MINOR:
        this._clearMoviesList();
        this._renderMovieList();
        break;
      case UpdateType.MAJOR:
        this._clearMoviesList({resetRenderedMovieCount: true, resetSortType: true});
        this._renderMovieList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderMovieList();
        break;
    }
  }

  _renderExtraBlocks() {
    if (this._getMovies().length !== 0) {
      this._topRatedComponent = new FilmsListExtraView('Top Rated');
      this._mostCommentedComponent = new FilmsListExtraView('Most Commented');

      render(this._filmsComponent, this._topRatedComponent, RenderPosition.BEFOREEND);
      render(this._filmsComponent, this._mostCommentedComponent, RenderPosition.BEFOREEND);

      const topRatedListFilmsElement = this._topRatedComponent.getElement().querySelector('.films-list__container');
      const mostCommentedListFilmsElement = this._mostCommentedComponent.getElement().querySelector('.films-list__container');

      const topRatedMovies = getTopRatedMovies(this._getMovies());
      const mostCommentedMovies = getMostCommentedMovies(this._getMovies());

      for (let i = 0; i < EXTRA_COUNT; i++) {
        this._renderMovie(topRatedListFilmsElement, topRatedMovies[i]);
      }

      for (let i = 0; i < EXTRA_COUNT; i++) {
        this._renderMovie(mostCommentedListFilmsElement, mostCommentedMovies[i]);
      }
    }
  }

  _renderLoading() {
    render(this._filmsComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovieList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderSort();

    render(this._movieListContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    const movies = this._getMovies();

    if (movies.length === 0) {
      this._renderNoMovies();
      return;
    }

    const filmsListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');

    const movieCount = movies.length;
    const newMovies = movies.slice(0, Math.min(movieCount, this._mainCount));

    this._renderMovies(newMovies, filmsListContainerElement);

    if (movieCount > MOVIES_PER_STEP) {
      this._renderLoadMoreButton(filmsListContainerElement);
    }
    this._renderExtraBlocks();
  }
}
