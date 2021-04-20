import PersonRankView from './view/person-rank';
import MainMenuView from './view/main-menu';
import FilmCartView from './view/film-cart';
import FilmsView from './view/films';
import FilmsListView from './view/films-list';
import FilmsListExtraView from './view/films-list-extra';
import ButtonShowMore from './view/button-show-more';
import FooterStatisticView from './view/footer-statistic';
import PopupExtraMoviesView from './view/film-details';
import {generateMovie} from './mock/movie';
import {getPersonRank, clipDescription, generateFilters, render, RenderPosition} from './utils/utils';

const EXTRA_COUNT = 2;
const MOVIES_PER_STEP = 5;
let mainCount = 5;
let currentAmountOfFilms = 0;

const movies = new Array(20).fill().map(generateMovie);

const numberMovies = movies.length;

const topRatedMovies = [...movies];
topRatedMovies.sort((a, b) => {
  return b.rating - a.rating;
});

const mostCommentedMovies = [...movies];
mostCommentedMovies.sort((a, b) => {
  return b.comments.length - a.comments.length;
});

const openPopup = (popup) => {
  document.body.classList.add('hide-overflow');
  document.body.appendChild(popup);
};

const closePopup = (popup) => {
  document.body.removeChild(popup);
  document.body.classList.remove('hide-overflow');
};

const cardClick = (movie) => {
  const popup = new PopupExtraMoviesView(movie).getElement();

  openPopup(popup);

  const closeButton = popup.querySelector('.film-details__close-btn');
  closeButton.addEventListener('click', () => {
    closePopup(popup);
  });
};

const renderMovie = (container, movie) => {
  const description = clipDescription(movie.description);

  const filmCartComponent = new FilmCartView(movie, description);

  filmCartComponent.getElement().addEventListener('click', (e) => {
    if (!['film-card__poster', 'film-card__title', 'film-card__comments'].includes(e.target.className)) {
      return;
    }

    e.preventDefault();
    cardClick(movie);
  });

  render(container, filmCartComponent.getElement(), RenderPosition.BEFOREEND);
};

const filters = generateFilters(movies);
const personRank = getPersonRank(filters.watchlist);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const footerStatisticElement = siteFooterElement.querySelector('.footer__statistics');

const filmsComponent = new FilmsView().getElement();

render(siteHeaderElement, new PersonRankView(personRank).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new MainMenuView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

const topRatedElement = new FilmsListExtraView('Top Rated');
const mostCommentedElement = new FilmsListExtraView('Most Commented');

render(filmsComponent, new FilmsListView().getElement(), RenderPosition.BEFOREEND);
render(filmsComponent, topRatedElement.getElement(), RenderPosition.BEFOREEND);
render(filmsComponent, mostCommentedElement.getElement(), RenderPosition.BEFOREEND);

const filmsListElement = filmsComponent.querySelector('.films-list');
const filmsListContainerElement = filmsComponent.querySelector('.films-list__container');

for (currentAmountOfFilms; currentAmountOfFilms < mainCount; currentAmountOfFilms++) {
  renderMovie(filmsListContainerElement, movies[currentAmountOfFilms]);
}

mainCount += MOVIES_PER_STEP;

if (numberMovies > mainCount) {
  const showMoreButtonElement = new ButtonShowMore().getElement();

  render(filmsListElement, showMoreButtonElement, RenderPosition.BEFOREEND);

  showMoreButtonElement.addEventListener('click', (e) => {
    e.preventDefault();

    for (currentAmountOfFilms; currentAmountOfFilms < mainCount; currentAmountOfFilms++) {
      renderMovie(filmsListContainerElement, movies[currentAmountOfFilms]);
    }

    mainCount += MOVIES_PER_STEP;

    if (numberMovies < mainCount) {
      showMoreButtonElement.remove();
    }
  });
}

const topRatedListFilmsElement = topRatedElement.getElement().querySelector('.films-list__container');
const mostCommentedListFilmsElement = mostCommentedElement.getElement().querySelector('.films-list__container');

for (let i = 0; i < EXTRA_COUNT; i++) {
  renderMovie(topRatedListFilmsElement, topRatedMovies[i]);
}

for (let i = 0; i < EXTRA_COUNT; i++) {
  renderMovie(mostCommentedListFilmsElement, mostCommentedMovies[i]);
}

render(footerStatisticElement, new FooterStatisticView(movies.length).getElement(), 'beforeend');
