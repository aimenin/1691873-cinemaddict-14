import {createPersonRankTemplate} from './view/personRank';
import {createMainMenuTemplate} from './view/mainMenu';
import {createFilmCartTemplate} from './view/filmCart';
import {createFilmsTemplate} from './view/films';
import {createFilmsListTemplate} from './view/filmsList';
import {createFilmsListExtraTemplate} from './view/filmsListExtra';
import {createButtonShowMoreTemplate} from './view/buttonShowMore';
import {createFooterStatisticTemplate} from './view/footerStatistic';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const footerStatisticElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, createPersonRankTemplate(), 'beforeend');
render(siteMainElement, createMainMenuTemplate(), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

const mainFilmsElement = siteMainElement.querySelector('.films');

render(mainFilmsElement, createFilmsListTemplate(), 'beforeend');
render(mainFilmsElement, createFilmsListExtraTemplate(), 'beforeend');
render(mainFilmsElement, createFilmsListExtraTemplate(), 'beforeend');

const filmsListElement = mainFilmsElement.querySelector('.films-list');
const filmsListContainerElement = mainFilmsElement.querySelector('.films-list__container');

const amountOfMainFilms = 5;

for (let i = 0; i < amountOfMainFilms; i++) {
  render(filmsListContainerElement, createFilmCartTemplate(), 'beforeend');
}

render(filmsListElement, createButtonShowMoreTemplate(), 'beforeend');

const topRatedFilmsBlockElement = mainFilmsElement.querySelectorAll('.films-list.films-list--extra')[0];
const mostCommentedFilmsBlockElement = mainFilmsElement.querySelectorAll('.films-list.films-list--extra')[1];

const topRatedListFilmsElement = topRatedFilmsBlockElement.querySelector('.films-list__container');
const mostCommentedListFilmsElement = mostCommentedFilmsBlockElement.querySelector('.films-list__container');

const amountOfExtraFilms = 2;

for (let i = 0; i < amountOfExtraFilms; i++) {
  render(topRatedListFilmsElement, createFilmCartTemplate(), 'beforeend');
}

for (let i = 0; i < amountOfExtraFilms; i++) {
  render(mostCommentedListFilmsElement, createFilmCartTemplate(), 'beforeend');
}

render(footerStatisticElement, createFooterStatisticTemplate(), 'beforeend');
