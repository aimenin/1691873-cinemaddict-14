import dayjs from 'dayjs';
import SmartView from './smart';
import {filterDueMovies, filterWatchedMovies, countWatchedMoviesDuration, countWatchedMoviesInDateRange, genres, mostLikelyGenre, genresArrayCount, genresArrayTitle} from '../utils/statistics';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {DateInterval} from '../const';

const BAR_HEIGHT = 50;

const statisticChart = (statisticCtx, countArray, titleArray) => {
  statisticCtx.height = BAR_HEIGHT * titleArray.length;

  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: titleArray,
      datasets: [{
        data: countArray,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return myChart;
};

const createStatisticsTemplate = (data, currentDateInterval, personRank) => {
  const {movies, dateFrom, dateTo} = data;

  const watchedMovies = filterWatchedMovies(movies);

  const dueMovies = filterDueMovies(watchedMovies, dateFrom, dateTo);

  let watchedMoviesCount = 0;
  let genresObject = {};
  let mostLikelyGenr = '';
  let hours = 0;
  let minutes = 0;

  if (dueMovies.length > 0) {
    watchedMoviesCount = countWatchedMoviesInDateRange(dueMovies);
    const watchedMoviesDuration = countWatchedMoviesDuration(dueMovies);
    hours = Math.floor(watchedMoviesDuration / 60);
    minutes = watchedMoviesDuration % 60;
    genresObject = genres(dueMovies);
    mostLikelyGenr = mostLikelyGenre(genresObject);
  }

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${personRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentDateInterval == DateInterval.ALLTIME ? 'checked' : null}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentDateInterval == DateInterval.DAY ? 'checked' : null}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentDateInterval == DateInterval.WEEK ? 'checked' : null}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentDateInterval == DateInterval.MONTH ? 'checked' : null}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentDateInterval == DateInterval.YEAR ? 'checked' : null}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedMoviesCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${mostLikelyGenr}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Statistics extends SmartView {
  constructor(movies, personRank) {
    super();

    this._currentDateInterval = DateInterval.ALLTIME;
    this._personRank = personRank;

    this._data = {
      movies,
      dateFrom: (() => {
        const yearsAgo = 200;
        return dayjs().subtract(yearsAgo, 'year').toDate();
      })(),
      dateTo: dayjs().toDate(),
    };

    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._dateClickHandler = this._dateClickHandler.bind(this);

    this._setCharts(this._data);
    this._setInnerHandlers();
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticsTemplate(this._data, this._currentDateInterval, this._personRank);
  }

  _dateChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo,
    });
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('click', this._dateClickHandler);
  }

  _dateClickHandler(evt) {
    if (evt.target.value == 'year') {
      if (this._currentDateInterval !== DateInterval.YEAR) {
        this._currentDateInterval = DateInterval.YEAR;
        this._dateChangeHandler([dayjs().subtract(1, DateInterval.YEAR).toDate(), dayjs().toDate()]);
      }
    }
    if (evt.target.value == 'month') {
      if (this._currentDateInterval !== DateInterval.MONTH) {
        this._currentDateInterval = DateInterval.MONTH;
        this._dateChangeHandler([dayjs().subtract(1, DateInterval.MONTH).toDate(), dayjs().toDate()]);
      }
    }
    if (evt.target.value == 'week') {
      if (this._currentDateInterval !== DateInterval.WEEK) {
        this._currentDateInterval = DateInterval.WEEK;
        this._dateChangeHandler([dayjs().subtract(1, DateInterval.WEEK).toDate(), dayjs().toDate()]);
      }
    }
    if (evt.target.value == 'today') {
      if (this._currentDateInterval !== DateInterval.DAY) {
        this._currentDateInterval = DateInterval.DAY;
        this._dateChangeHandler([dayjs().subtract(1, 'day').toDate(), dayjs().toDate()]);
      }
    }
    if (evt.target.value == 'all-time') {
      if (this._currentDateInterval !== DateInterval.ALLTIME) {
        this._currentDateInterval = DateInterval.ALLTIME;
        this._dateChangeHandler([dayjs().subtract(200, DateInterval.YEAR).toDate(), dayjs().toDate()]);
      }
    }
  }

  _setCharts(data) {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    const {movies, dateFrom, dateTo} = data;

    const watchedMovies = filterWatchedMovies(movies);

    const dueMovies = filterDueMovies(watchedMovies, dateFrom, dateTo);

    let genresObject = {};

    if (dueMovies.length > 0) {
      genresObject = genres(dueMovies);
      const countArray = genresArrayCount(genresObject);
      const titlesArray = genresArrayTitle(genresObject);

      statisticChart(statisticCtx, countArray, titlesArray);
    }
    // нужно отрисовать график
  }

  restoreHandlers() {
    this._setCharts(this._data);
    this._setInnerHandlers();
  }
}
