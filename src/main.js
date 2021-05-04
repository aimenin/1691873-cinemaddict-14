import PersonRankView from './view/person-rank';
import FooterStatisticView from './view/footer-statistic';
import {generateMovie} from './mock/movie';
import { generateFilters, getPersonRank } from './utils/movie';
import {RenderPosition, render} from './utils/render';
import MoviesListPresenter from './presenter/movie-list';

const movies = new Array(20).fill().map(generateMovie);

const filters = generateFilters(movies);
const personRank = getPersonRank(filters.watchlist);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const footerStatisticElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new PersonRankView(personRank), RenderPosition.BEFOREEND);

const moviesPresenter = new MoviesListPresenter(siteMainElement);
moviesPresenter.init(movies);

render(footerStatisticElement, new FooterStatisticView(movies.length), 'beforeend');
