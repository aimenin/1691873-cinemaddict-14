import PersonRankView from './view/person-rank';
import FooterStatisticView from './view/footer-statistic';
import {generateFilters, getPersonRank} from './utils/movie';
import {RenderPosition, render, remove} from './utils/render';
import MoviesListPresenter from './presenter/movie-list';
import FilterPresenter from './presenter/filter';
import MoviesModel from './model/movies';
import FilterModel from './model/filter';
import {MenuItem} from './const';
import StatisticsView from './view/statistics';
import {FilterType, UpdateType, AUTHORIZATION, END_POINT} from './const';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';

let statisticComponent = null;
let personRank = '';

const api = new Api(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

const STORE_MOVIES_PREFIX = 'sinemaAddictMovies-localstorage';
const STORE_COMMENTS_PREFIX = 'sinemaAddictComments-localstorage';
const STORE_VER = 'v14';
const STORE_MOVIES_NAME = `${STORE_MOVIES_PREFIX}-${STORE_VER}`;
const STORE_COMMENTS_NAME = `${STORE_COMMENTS_PREFIX}-${STORE_VER}`;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.MOVIES:
      moviesPresenter.init();
      remove(statisticComponent);
      break;
    case MenuItem.STATISTIC:
      moviesPresenter.destroy();
      statisticComponent = new StatisticsView(moviesModel.getMovies(), personRank);
      render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL, MenuItem.STATISTIC);
      break;
  }
};

const filterModel = new FilterModel();

const moviesStore = new Store(STORE_MOVIES_NAME, window.localStorage);
const commentsStore = new Store(STORE_COMMENTS_NAME, window.localStorage);
const apiMoviesWithProvider = new Provider(api, moviesStore);
const apiCommentsWithProvider = new Provider(api, commentsStore);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const footerStatisticElement = siteFooterElement.querySelector('.footer__statistics');

const moviesPresenter = new MoviesListPresenter(siteMainElement, moviesModel, filterModel, apiMoviesWithProvider, apiCommentsWithProvider);
moviesPresenter.init();

apiMoviesWithProvider.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    const filters = generateFilters(movies);
    personRank = getPersonRank(filters.history);
    render(siteHeaderElement, new PersonRankView(personRank), RenderPosition.BEFOREEND);
    render(footerStatisticElement, new FooterStatisticView(movies.length), 'beforeend');
    const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel, handleSiteMenuClick);
    filterPresenter.init();
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
    render(siteHeaderElement, new PersonRankView(''), RenderPosition.BEFOREEND);
    render(footerStatisticElement, new FooterStatisticView(0), 'beforeend');
    const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel, handleSiteMenuClick);
    filterPresenter.init();
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiMoviesWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
