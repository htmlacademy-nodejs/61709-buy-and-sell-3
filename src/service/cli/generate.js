'use strict';

const fs = require(`fs`);
const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const {
  ExitCode,
  DEFAULT_COUNT,
  FILE_NAME,
  TITLES,
  SENTENCES,
  CATEGORIES,
  OfferType,
  SumRestrict,
  PictureRestrict,
  GeneratorSlicer
} = require(`../../constants`);

const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;
const getCategory = (categories) => [categories[getRandomInt(0, categories.length - 1)]];
const getDescription = (sentences) => shuffle(sentences).slice(GeneratorSlicer.START, GeneratorSlicer.END).join(` `);
const getOfferType = (offerType) => Object.keys(offerType)[Math.floor(Math.random() * Object.keys(offerType).length)];
const getTitle = (titles) => titles[getRandomInt(0, titles.length - 1)];

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    category: getCategory(CATEGORIES),
    description: getDescription(SENTENCES),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: getTitle(TITLES),
    type: getOfferType(OfferType),
    sum: getRandomInt(SumRestrict.min, SumRestrict.max)
  }))
);

module.exports = {
  name: `--generate`,
  run(userInputValue) {
    const countOffer = Math.abs(Number.parseInt(userInputValue, 10) || DEFAULT_COUNT);
    const content = JSON.stringify(generateOffers(countOffer));

    try {
      fs.writeFileSync(FILE_NAME, content);
      return console.log(`Operation success. File created.`);
    } catch (e) {
      console.error(`Can't write data to file...`);
      return process.exit(ExitCode.ERROR);
    }
  }
};
