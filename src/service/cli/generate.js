'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  getRandomInt,
  shuffle,
  readContent,
  printNumWithLead0,
  makePriceWithSpaces
} = require(`../../utils`);

const {
  DEFAULT_COUNT,
  MAX_ID_LENGTH,
  MAX_COMMENTS_COUNT,
  FilePath,
  OfferType,
  SumRestrict,
  PictureRestrict,
  GeneratorSlicer
} = require(`../service-constants`);

const {ExitCode} = require(`../../constants`);

const getOfferPrice = (price) => makePriceWithSpaces(price);
const getPictureFileName = (number) => {
  const numWithLead0 = `${printNumWithLead0(number)}`;
  return {
    background: numWithLead0,
    image: `item${numWithLead0}.jpg`,
    image2x: `item${numWithLead0}@2x.jpg`
  };
};
const getCategory = (categories) => shuffle(categories).slice(0, getRandomInt(1, categories.length - 1));
const getDescription = (sentences) => shuffle(sentences).slice(GeneratorSlicer.START, GeneratorSlicer.END).join(` `);
const getOfferType = (offerType) => offerType[Object.keys(offerType)[Math.floor(Math.random() * Object.keys(offerType).length)]];
const getTitle = (titles) => titles[getRandomInt(0, titles.length - 1)];
const getComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments).slice(0, getRandomInt(1, comments.length - 1)).join(` `)
  }))
);

const generateOffers = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    category: getCategory(categories),
    description: getDescription(sentences),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: getTitle(titles),
    type: getOfferType(OfferType),
    sum: getOfferPrice(getRandomInt(SumRestrict.MIN, SumRestrict.MAX)),
    comments: getComments(getRandomInt(1, MAX_COMMENTS_COUNT), comments)
  }))
);

module.exports = {
  name: `--generate`,
  async run(count) {
    const sentences = await readContent(FilePath.SENTENCES);
    const titles = await readContent(FilePath.TITLES);
    const categories = await readContent(FilePath.CATEGORIES);
    const comments = await readContent(FilePath.COMMENTS);
    const countOffer = Math.abs(Number.parseInt(count, 10) || DEFAULT_COUNT);
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FilePath.MOCKS, content);
      return console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      return process.exit(ExitCode.ERROR);
    }
  }
};
