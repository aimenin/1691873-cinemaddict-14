import {nanoid} from 'nanoid';
import {getRandomInteger} from '../utils/common';

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
    id: nanoid(),
    comment: generateText(),
    emotion: generateEmotion(),
    authorName: generateAuthorName(),
    date: new Date(getRandomInteger(2020, 2021), getRandomInteger(0, 11), getRandomInteger(0, 29)).toISOString(),
  };
};
