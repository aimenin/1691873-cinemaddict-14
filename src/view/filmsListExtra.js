// шаблон для экстра блока(самые просматриваемые, самые прокаменчиные)
export const createFilmsListExtraTemplate = (blockName) => {
  return `<section class="films-list films-list--extra">
  <h2 class="films-list__title">${blockName}</h2>

  <div class="films-list__container">
  </section>`;
};
