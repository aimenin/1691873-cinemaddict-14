import {createPersonRankTemplate} from './view/personRank';
import {createMainMenuTemplate} from './view/mainMenu';
import {createFilmCartTemplate} from './view/filmCart';
import {createFilmsTemplate} from './view/films';
import {createFilmsListTemplate} from './view/filmsList';
import {createFilmsListExtraTemplate} from './view/filmsListExtra';
import {createButtonShowMoreTemplate} from './view/buttonShowMore';
import {createFooterStatisticTemplate} from './view/footerStatistic';
import {generateMovie} from './mock/movie';

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

const watchlist = movies.filter((movie) => {
  return movie.user_details.watchlist;
});

const history = movies.filter((movie) => {
  return movie.user_details.already_watched;
});

const favorites = movies.filter((movie) => {
  return movie.user_details.favorite;
});

const filters = {
  watchlist,
  history,
  favorites,
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const footerStatisticElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, createPersonRankTemplate(watchlist), 'beforeend');
render(siteMainElement, createMainMenuTemplate(filters), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

const mainFilmsElement = siteMainElement.querySelector('.films');

render(mainFilmsElement, createFilmsListTemplate(), 'beforeend');
render(mainFilmsElement, createFilmsListExtraTemplate('Top Rated'), 'beforeend');
render(mainFilmsElement, createFilmsListExtraTemplate('Most Commented'), 'beforeend');

const filmsListElement = mainFilmsElement.querySelector('.films-list');
const filmsListContainerElement = mainFilmsElement.querySelector('.films-list__container');

for (currentAmountOfFilms; currentAmountOfFilms < mainCount; currentAmountOfFilms++) {
  render(filmsListContainerElement, createFilmCartTemplate(movies[currentAmountOfFilms]), 'beforeend');
}

mainCount += MOVIES_PER_STEP;

if (numberMovies > mainCount) {
  render(filmsListElement, createButtonShowMoreTemplate(), 'beforeend');

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (e) => {
    e.preventDefault();

    for (currentAmountOfFilms; currentAmountOfFilms < mainCount; currentAmountOfFilms++) {
      render(filmsListContainerElement, createFilmCartTemplate(movies[currentAmountOfFilms]), 'beforeend');
    }

    mainCount += MOVIES_PER_STEP;

    if (numberMovies < mainCount) {
      showMoreButton.remove();
    }
  });
}

const topRatedFilmsBlockElement = mainFilmsElement.querySelectorAll('.films-list.films-list--extra')[0];
const mostCommentedFilmsBlockElement = mainFilmsElement.querySelectorAll('.films-list.films-list--extra')[1];

const topRatedListFilmsElement = topRatedFilmsBlockElement.querySelector('.films-list__container');
const mostCommentedListFilmsElement = mostCommentedFilmsBlockElement.querySelector('.films-list__container');

for (let i = 0; i < EXTRA_COUNT; i++) {
  render(topRatedListFilmsElement, createFilmCartTemplate(topRatedMovies[i]), 'beforeend');
}

for (let i = 0; i < EXTRA_COUNT; i++) {
  render(mostCommentedListFilmsElement, createFilmCartTemplate(mostCommentedMovies[i]), 'beforeend');
}

render(footerStatisticElement, createFooterStatisticTemplate(movies.length), 'beforeend');
