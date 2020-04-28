'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle,
  readContent
} = require(`../../utils`);

const {
  ExitCode,
  DEFAULT_COUNT,
  FilePath,
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

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    category: getCategory(categories),
    description: getDescription(sentences),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: getTitle(titles),
    type: getOfferType(OfferType),
    sum: getRandomInt(SumRestrict.min, SumRestrict.max)
  }))
);

module.exports = {
  name: `--generate`,
  async run(userInputValue) {
    const sentences = await readContent(FilePath.SENTENCES);
    const titles = await readContent(FilePath.TITLES);
    const categories = await readContent(FilePath.CATEGORIES);
    const countOffer = Math.abs(Number.parseInt(userInputValue, 10) || DEFAULT_COUNT);
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(FilePath.MOCKS, content);
      return console.log(chalk.green(`Operation success. File created.`));
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      return process.exit(ExitCode.ERROR);
    }
  }
};
