import AbstractView from './abstract';

// шаблон для главной секции сайта
const createFilmsTemplate = () => {
  return '<section class="films"></section>';
};

export default class Films extends AbstractView {
  getTemplate() {
    return createFilmsTemplate();
  }
}


