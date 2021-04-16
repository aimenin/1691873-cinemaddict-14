import dayjs from 'dayjs';
import {getRandomInteger} from '../utils/utils';

const generateText = () => {
  const commentsText = [
    'it was good',
    'good job guys',
    'it was awful',
    'so boring movie',
    'i like it!',
  ];

  return commentsText[getRandomInteger(0, commentsText.length - 1)];
};

const generateEmotion = () => {
  const emotions = [
    'smile',
    'sleeping',
    'puke',
    'angry',
  ];

  return emotions[getRandomInteger(0, emotions.length - 1)];
};

const generateAuthorName = () => {
  const names = [
    'Oleg',
    'Artem',
    'Olga',
  ];

  return names[getRandomInteger(0, names.length - 1)];
};

export const generateComment = () => {
  return {
    text: generateText(),
    emotion: generateEmotion(),
    authorName: generateAuthorName(),
    date: dayjs().subtract(getRandomInteger(0, 2), 'day').subtract(getRandomInteger(0, 3), 'hour').format('YYYY/MM/DD HH:mm'),
  };
};
