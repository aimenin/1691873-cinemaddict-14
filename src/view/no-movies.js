import AbstractView from './abstract';

// шаблон для главной секции сайта
const createNoMoviesTemplate = () => {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
};

export default class NoMovies extends AbstractView {
  getTemplate() {
    return createNoMoviesTemplate();
  }
}


