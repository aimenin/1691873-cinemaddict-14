import SortView from '../view/sort';
import FilmsListExtraView from '../view/films-list-extra';
import NoMoviesView from '../view/no-movies';
import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import ButtonShowMore from '../view/button-show-more';
import MoviePresenter from './movie';
import {getMostCommentedMovies, getTopRatedMovies, sortDate, sortRating} from '../utils/movie';
import {render, RenderPosition, remove} from '../utils/render';
import {SortType, UpdateType, MovieAction, CommentAction} from '../const';
import {filter} from '../utils/filter';

const EXTRA_COUNT = 2;
const MOVIES_PER_STEP = 5;

export default class MovieList {
  constructor(movieListComponent, moviesModel, filterModel, commentsModel) {
    this._movieListContainer = movieListComponent;
    this._currentSortType = SortType.DEFAULT;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;

    this._noMoviesComponent = new NoMoviesView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._loadMoreButton = null;
    this._topRatedComponent = null;
    this._mostCommentedComponent = null;
    this._sortComponent = null;

    this._mainCount = MOVIES_PER_STEP;
    this._filmCartPresenter = {};

    // this._handleMovieCartChange = this._handleMovieCartChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleCommentAction = this._handleCommentAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._filterComments = this._filterComments.bind(this);
    this._handleCommentEvent = this._handleCommentEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleCommentEvent);
  }

  init() {
    render(this._movieListContainer, this._filmsComponent, RenderPosition.AFTERBEGIN);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);

    this._renderMovieList();
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
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

  _filterComments(movie) {
    const allComments = this._commentsModel.getComments();

    const movieCommentsIDs = movie.comments;

    const comments = movieCommentsIDs.map((id) => {
      const comment = allComments.find((globalComment) => globalComment.id === id);
      if (comment !== undefined) {
        return comment;
      }
    });

    return comments;
  }

  // _sortMovie(sortType) {
  //   switch (sortType) {
  //     case SortType.DATE:
  //       this._movies.sort(sortDate);
  //       break;
  //     case SortType.RATING:
  //       this._movies.sort(sortRating);
  //       break;
  //     default:
  //       this._movies = this._sourced.slice();
  //   }

  //   this._currentSortType = sortType;
  // }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    // this._sortMovie(sortType);
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

    render(this._movieListContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoMovies() {
    render(this._filmsComponent, this._noMoviesComponent(), RenderPosition.BEFOREEND);
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
    const comments = this._filterComments(movie);
    const moviePresenter = new MoviePresenter(container, this._handleViewAction, this._handleModeChange, this._handleCommentAction);
    moviePresenter.init(movie, comments);
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
    remove(this._sortComponent);
    remove(this._topRatedComponent);
    remove(this._mostCommentedComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderMovies(movies, container) {
    // this._movies
    //   .slice(from, to)
    //   .forEach((movie) => this._renderMovie(container, movie));
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

  // _handleMovieCartChange(updatedMovie) {
  //   this._movies = updateItem(this._movies, updatedMovie);
  //   this._sourced = updateItem(this._sourced, updatedMovie);
  //   Здесь будем вызывать обновление модели
  //   this._filmCartPresenter[updatedMovie.id].forEach((presenter) => {
  //     presenter.init(updatedMovie);
  //   });
  // }

  _handleViewAction(actionType, updateType, update) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case MovieAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(updateType, update);
    }
  }

  _handleCommentAction(actionType, updateType, update) {
    switch (actionType) {
      case CommentAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
      case CommentAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
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
        // обновит весь презентер
        this._clearMoviesList({resetRenderedMovieCount: true, resetSortType: true});
        this._renderMovieList();
        break;
    }
  }

  _handleCommentEvent(updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        // minor
        break;
      case UpdateType.MAJOR:
        // обновит весь презентер
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

  _renderMovieList() {
    if (this._getMovies().length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();
    const filmsListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');

    const movieCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(movieCount, this._mainCount));

    this._renderMovies(movies, filmsListContainerElement);

    if (movieCount > MOVIES_PER_STEP) {
      this._renderLoadMoreButton(filmsListContainerElement);
    }
    this._renderExtraBlocks();
  }
}
