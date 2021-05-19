import PersonRankView from './view/person-rank';
import FooterStatisticView from './view/footer-statistic';
import {generateMovie, comments} from './mock/movie';
import {generateFilters, getPersonRank} from './utils/movie';
import {RenderPosition, render} from './utils/render';
import MoviesListPresenter from './presenter/movie-list';
import FilterPresenter from './presenter/filter';
import MoviesModel from './model/movies';
import CommentsModel from './model/comments';
import FilterModel from './model/filter';

const movies = new Array(20).fill().map(generateMovie);

const filters = generateFilters(movies);
const personRank = getPersonRank(filters.watchlist);

const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const footerStatisticElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new PersonRankView(personRank), RenderPosition.BEFOREEND);

const moviesPresenter = new MoviesListPresenter(siteMainElement, moviesModel, filterModel, commentsModel);
moviesPresenter.init();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
filterPresenter.init();

render(footerStatisticElement, new FooterStatisticView(movies.length), 'beforeend');
