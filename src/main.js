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
import Api from './api';

let statisticComponent = null;
let personRank = '';

const api = new Api(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.MOVIES:
      remove(statisticComponent);
      moviesPresenter.init();
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

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const footerStatisticElement = siteFooterElement.querySelector('.footer__statistics');

const moviesPresenter = new MoviesListPresenter(siteMainElement, moviesModel, filterModel, api);
moviesPresenter.init();

api.getMovies()
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
