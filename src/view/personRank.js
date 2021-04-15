// шаблон для ранга пользователя
export const createPersonRankTemplate = (watchlist) => {
  let rank = '';

  const numberOfWatchlist = watchlist.length;

  if (numberOfWatchlist > 1 && numberOfWatchlist <= 10) {
    rank = 'Novice';
  }

  if (numberOfWatchlist > 11 && numberOfWatchlist <= 20) {
    rank = 'Fan';
  }

  if (numberOfWatchlist > 20) {
    rank = 'Movie Buff';
  }

  return `<section class="header__profile profile">
  <p class="profile__rating">${rank}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
