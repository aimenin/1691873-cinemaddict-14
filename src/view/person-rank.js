import AbstractView from './abstract';

// шаблон для ранга пользователя
const createPersonRankTemplate = (rank) => {
  return `<section class="header__profile profile">
  <p class="profile__rating">${rank}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class PersonRank extends AbstractView {
  constructor(rank) {
    super();

    this._rank = rank;
  }

  getTemplate() {
    return createPersonRankTemplate(this._rank);
  }
}
