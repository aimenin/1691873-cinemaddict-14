import PersonRankView from './view/person-rank';
import MainMenuView from './view/main-menu';
import FilmCartView from './view/film-cart';
import FilmsView from './view/films';
import FilmsListView from './view/films-list';
import FilmsListExtraView from './view/films-list-extra';
import ButtonShowMore from './view/button-show-more';
import FooterStatisticView from './view/footer-statistic';
import PopupExtraMoviesView from './view/film-details';
import NoMoviesView from './view/no-movies';
import {generateMovie} from './mock/movie';
import { clipDescription, generateFilters, getPersonRank, getMostCommentedMovies, getTopRatedMovies } from './utils/movie';
import {RenderPosition, render, remove} from './utils/render';

const EXTRA_COUNT = 2;
const MOVIES_PER_STEP = 5;
let mainCount = 5;
let currentAmountOfFilms = 0;

const movies = new Array(20).fill().map(generateMovie);

const numberMovies = movies.length;

const topRatedMovies = getTopRatedMovies(movies);

const mostCommentedMovies = getMostCommentedMovies(movies);

const cardClick = (movie) => {
  const popup = new PopupExtraMoviesView(movie);

  const openPopup = () => {
    document.body.classList.add('hide-overflow');
    document.body.appendChild(popup.getElement());
  };

  const closePopup = () => {
    document.body.removeChild(popup.getElement());
    document.body.classList.remove('hide-overflow');
  };

  const onEscKeyDown = (e) => {
    if (e.key == 'Escape' || e.key == 'Esc') {
      e.preventDefault();
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  openPopup(popup.getElement());

  document.addEventListener('keydown', onEscKeyDown);

  popup.setCloseClickHandler(() => {
    closePopup(popup.getElement());
    document.removeEventListener('keydown', onEscKeyDown);
  });
};

const renderMovie = (container, movie) => {
  const description = clipDescription(movie.description);

  const filmCartComponent = new FilmCartView(movie, description);

  filmCartComponent.setClickHandler(() => {
    cardClick(movie);
  });

  render(container, filmCartComponent, RenderPosition.BEFOREEND);
};

const renderExtraBlocks = () => {
  if (movies.length !== 0) {
    const topRatedElement = new FilmsListExtraView('Top Rated');
    const mostCommentedElement = new FilmsListExtraView('Most Commented');

    render(filmsComponent, topRatedElement, RenderPosition.BEFOREEND);
    render(filmsComponent, mostCommentedElement, RenderPosition.BEFOREEND);

    const topRatedListFilmsElement = topRatedElement.getElement().querySelector('.films-list__container');
    const mostCommentedListFilmsElement = mostCommentedElement.getElement().querySelector('.films-list__container');

    for (let i = 0; i < EXTRA_COUNT; i++) {
      renderMovie(topRatedListFilmsElement, topRatedMovies[i]);
    }

    for (let i = 0; i < EXTRA_COUNT; i++) {
      renderMovie(mostCommentedListFilmsElement, mostCommentedMovies[i]);
    }
  }
};

const filters = generateFilters(movies);
const personRank = getPersonRank(filters.watchlist);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const footerStatisticElement = siteFooterElement.querySelector('.footer__statistics');

const filmsComponent = new FilmsView().getElement();

render(siteHeaderElement, new PersonRankView(personRank), RenderPosition.BEFOREEND);
render(siteMainElement, new MainMenuView(filters), RenderPosition.BEFOREEND);
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

render(filmsComponent, new FilmsListView(), RenderPosition.BEFOREEND);

const filmsListElement = filmsComponent.querySelector('.films-list');
const filmsListContainerElement = filmsComponent.querySelector('.films-list__container');

if (movies.length !== 0) {
  for (currentAmountOfFilms; currentAmountOfFilms < mainCount; currentAmountOfFilms++) {
    renderMovie(filmsListContainerElement, movies[currentAmountOfFilms]);
  }

  mainCount += MOVIES_PER_STEP;
} else {
  render(filmsListContainerElement, new NoMoviesView(), RenderPosition.BEFOREEND);
}

if (numberMovies > mainCount) {
  const showMoreButtonElement = new ButtonShowMore();

  render(filmsListElement, showMoreButtonElement, RenderPosition.BEFOREEND);

  showMoreButtonElement.setClickHandler(() => {
    for (currentAmountOfFilms; currentAmountOfFilms < mainCount; currentAmountOfFilms++) {
      renderMovie(filmsListContainerElement, movies[currentAmountOfFilms]);
    }

    mainCount += MOVIES_PER_STEP;

    if (numberMovies < mainCount) {
      remove(showMoreButtonElement);
    }
  });
}

renderExtraBlocks();

render(footerStatisticElement, new FooterStatisticView(movies.length), 'beforeend');
