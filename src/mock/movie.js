import dayjs from 'dayjs';
import {generateComment} from './comment';
import {getRandomInteger} from '../utils/utils';

const generatePeoplesNames = () => {
  const names = [
    'Самэль Эль Джексон',
    'Лева Дикаприо',
    'Александр Петров',
    'Евгений Батиков',
    'Никита Михалков',
  ];

  return names[getRandomInteger(0, names.length - 1)];
};

const generateArray = (generationFunction) => {
  const arrayOfPeople = [];

  for (let i = 0; i < getRandomInteger(1, 3); i++) {
    arrayOfPeople.push(generationFunction());
  }

  return arrayOfPeople;
};

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const randomLength = getRandomInteger(1, 5);

  let description = '';

  for (let i = 0; i < randomLength; i++) {
    description = description + ' ' + descriptions[getRandomInteger(0, descriptions.length)];
  }

  return description;
};

const generateGenre = () => {
  const genres = [
    'Комедия',
    'Ужасы',
    'Триллер',
    'Фантастика',
    'Экшен',
    'Драма',
    'Романтика',
  ];

  return genres[getRandomInteger(0, genres.length - 1)];
};

const generateAgeRating = () => {
  const ratings = [
    '0+',
    '7+',
    '12+',
    '16+',
    '18+',
  ];

  return ratings[getRandomInteger(0, ratings.length - 1)];
};

const generateCountry = () => {
  const countries = [
    'Russia',
    'USA',
    'England',
    'Poland',
    'Australia',
  ];

  return countries[getRandomInteger(0, countries.length - 1)];
};

const generatePosters = () => {
  const urls = [
    '/images/posters/the-dance-of-life.jpg',
    '/images/posters/made-for-each-other.png',
    '/images/posters/popeye-meets-sinbad.png',
    '/images/posters/sagebrush-trail.jpg',
    '/images/posters/santa-claus-conquers-the-martians.jpg',
    '/images/posters/the-great-flamarion.jpg',
    '/images/posters/the-man-with-the-golden-arm.jpg',
  ];

  return urls[getRandomInteger(0, urls.length - 1)];
};

const generateName = () => {
  const names = [
    'Карты, деньги, два ствола',
    'Жизнь п',
    'Мой друг Иван Лапшин',
    'Таксист',
    'Майор Гром',
  ];

  return names[getRandomInteger(0, names.length - 1)];
};

const generateOriginalName = () => {
  const originalNames = [
    'Lock, Stock and Two Smoking Barrels',
    'Life of Pi',
    'Мой друг Иван Лапшин',
    'Taxi Driver',
    'Майор Гром',
  ];

  return originalNames[getRandomInteger(0, originalNames.length - 1)];
};

const generateRating = () => {
  return getRandomInteger(10, 100) / 10;
};

const generateDuration = () => {
  const hours = getRandomInteger(1, 4);
  let minutes = getRandomInteger(1, 59);

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  return hours + 'h ' + minutes + 'm';
};

export const generateMovie = () => {
  return {
    name: generateName(),
    originalName: generateOriginalName(),
    posterUrl: generatePosters(),
    year: getRandomInteger(1980, 2021),
    description: generateDescription(),
    rating: generateRating(),
    director: generatePeoplesNames(),
    writers: generateArray(generatePeoplesNames),
    actors: generateArray(generatePeoplesNames),
    releaseTime: dayjs().subtract(getRandomInteger(1, 10), 'year').subtract(getRandomInteger(1, 10), 'month').add(getRandomInteger(-10, 10), 'day').format('DD-MMMM-YYYY'),
    duration: generateDuration(),
    countries: generateArray(generateCountry),
    genres: generateArray(generateGenre),
    ageRating: generateAgeRating(),
    comments: new Array(getRandomInteger(0, 5)).fill().map(generateComment),
    user_details: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      already_watched: Boolean(getRandomInteger(0, 1)),
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};
