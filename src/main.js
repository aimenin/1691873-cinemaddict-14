import PersonRankView from './view/personRank';
import MainMenuView from './view/mainMenu';
import FilmCartView from './view/filmCart';
import FilmsView from './view/films';
import FilmsListView from './view/filmsList';
import FilmsListExtraView from './view/filmsListExtra';
import ButtonShowMore from './view/buttonShowMore';
import FooterStatisticView from './view/footerStatistic';
import PopupExtraMoviesView from './view/filmDetails';
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

const cartClick = (movie) => {
  const popup = new PopupExtraMoviesView(movie).getElement();

  document.body.classList.add('hide-overflow');
  document.body.appendChild(popup);

  const closeButton = popup.querySelector('.film-details__close-btn');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(popup);
    document.body.classList.remove('hide-overflow');
    closeButton.removeEventListener('click');
  });
};

const renderMovie = (container, movie) => {
  const description = clipDescription(movie.description);

  const filmCartComponent = new FilmCartView(movie, description);

  render(container, filmCartComponent.getElement(), RenderPosition.BEFOREEND);

  const poster = filmCartComponent.getElement().querySelector('.film-card__poster');
  const title = filmCartComponent.getElement().querySelector('.film-card__title');
  const comments = filmCartComponent.getElement().querySelector('.film-card__comments');

  poster.addEventListener('click', (event) => {
    event.preventDefault();
    cartClick(movie);
  });

  title.addEventListener('click', (event) => {
    event.preventDefault();
    cartClick(movie);
  });

  comments.addEventListener('click', (event) => {
    event.preventDefault();
    cartClick(movie);
  });
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
