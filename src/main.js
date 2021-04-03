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
}

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const footerStatistic = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, createPersonRankTemplate(), 'beforeend');
render(siteMainElement, createMainMenuTemplate(), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

const mainFilms = siteMainElement.querySelector('.films');

render(mainFilms, createFilmsListTemplate(), 'beforeend');
render(mainFilms, createFilmsListExtraTemplate(), 'beforeend');
render(mainFilms, createFilmsListExtraTemplate(), 'beforeend');

const filmsList = mainFilms.querySelector('.films-list');
const filmsListContainer = mainFilms.querySelector('.films-list__container');

for (let i = 0; i < 5; i++) {
    render(filmsListContainer, createFilmCartTemplate(), 'beforeend');
}

render(filmsList, createButtonShowMoreTemplate(), 'beforeend');

const topRatedFilmsBlock = mainFilms.querySelectorAll(".films-list.films-list--extra")[0];
const mostCommentedFilmsBlock = mainFilms.querySelectorAll(".films-list.films-list--extra")[1];

const topRatedListFilms = topRatedFilmsBlock.querySelector('.films-list__container');
const mostCommentedListFilms = mostCommentedFilmsBlock.querySelector('.films-list__container');

for (let i = 0; i < 2; i++) {
    render(topRatedListFilms, createFilmCartTemplate(), 'beforeend');
}

for (let i = 0; i < 2; i++) {
    render(mostCommentedListFilms, createFilmCartTemplate(), 'beforeend');
}

render(footerStatistic, createFooterStatisticTemplate(), 'beforeend');
