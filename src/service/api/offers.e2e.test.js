'use strict';

const request = require(`supertest`);
const {getServer} = require(`../api-server/api-server`);
const {HttpCode} = require(`../service-constants`);

describe(`Offers API end-to-end tests`, () => {

  describe(`Get all offers tests`, () => {

    test(`Get all offers with status code 200`, async () => {
      const server = await getServer();
      const res = await request(server).get(`/api/offers`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe(`Get offer by id tests`, () => {

    test(`Get offer by id with status code 200`, async () => {
      const server = await getServer();
      const offerId = `AVvorR`;
      const res = await request(server).get(`/api/offers/${offerId}`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(typeof (res.body)).toBe(`object`);
    });

    test(`Get offer by id with status code 404`, async () => {
      const server = await getServer();
      const offerId = `AVvorg`;
      const res = await request(server).get(`/api/offers/${offerId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body).toStrictEqual({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Offer with id: ${offerId} is not found`
      });
    });
  });

  describe(`Create new offer test`, () => {

    test(`Must create a new offer and return it with status code 201`, async () => {
      const server = await getServer();
      const newOffer = {
        category: [`Разное`],
        description: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
        picture: `item03.jpg`,
        title: `Продам новую приставку Sony Playstation 5.`,
        sum: 42698,
        type: `offer`,
        comments: []
      };
      const res = await request(server).post(`/api/offers`).send(newOffer);
      const {id} = res.body;

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body).toStrictEqual({...newOffer, id});
    });

    test(`Invalid offer data sent. Request must end with status code 400`, async () => {
      const server = await getServer();
      const newOffer = {
        description: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
        picture: `item03.jpg`,
        title: `Продам новую приставку Sony Playstation 5.`,
        sum: 42698,
        type: `offer`,
        comments: []
      };
      const res = await request(server).post(`/api/offers`).send(newOffer);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.body).toStrictEqual({
        error: true,
        status: HttpCode.BAD_REQUEST,
        message: `Incorrect offer data sent`
      });
    });
  });

  describe(`Update offer by id tests`, () => {

    test(`Update offer by id with status code 200`, async () => {
      const server = await getServer();
      const offerId = `tBCau-`;
      const offerData = {
        category: [`Авто`],
        description: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
        picture: `item03.jpg`,
        title: `Новый заголовок`,
        sum: 900,
        type: `offer`,
        comments: []
      };
      const res = await request(server).put(`/api/offers/${offerId}`).send(offerData);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(res.body).toStrictEqual({...offerData, ...{id: offerId}});
    });

    test(`Update offer by id with status code 400`, async () => {
      const server = await getServer();
      const offerId = `tBCau-`;
      const offerData = {
        description: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
        picture: `item03.jpg`,
        title: `Новый заголовок`,
        sum: 900,
        type: `offer`,
        comments: []
      };
      const res = await request(server).put(`/api/offers/${offerId}`).send(offerData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.body).toStrictEqual({
        error: true,
        status: HttpCode.BAD_REQUEST,
        message: `Incorrect offer data sent`
      });
    });

    test(`Update offer by id with status code 404`, async () => {
      const server = await getServer();
      const offerId = `tBCau`;
      const offerData = {
        category: [`Авто`],
        description: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
        picture: `item03.jpg`,
        title: `Новый заголовок`,
        sum: 900,
        type: `offer`,
        comments: []
      };
      const res = await request(server).put(`/api/offers/${offerId}`).send(offerData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body).toStrictEqual({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Offer with id: ${offerId} is not found`
      });
    });

  });

  describe(`Get offer comments tests`, () => {

    test(`Get offer comments with status code 200`, async () => {
      const server = await getServer();
      const offerId = `AVvorR`;
      const res = await request(server).get(`/api/offers/${offerId}/comments`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test(`Get offer comments with status code 404 (offer not found)`, async () => {
      const server = await getServer();
      const offerId = `AVvorr`;
      const res = await request(server).get(`/api/offers/${offerId}/comments`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body).toStrictEqual({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Offer with id: ${offerId} is not found`
      });
    });

  });

  describe(`Create a new offer comment tests`, () => {

    test(`Create a new offer comment with status code 200`, async () => {
      const server = await getServer();
      const offerId = `AVvorR`;
      const commentData = {text: `New test comment`};
      const res = await request(server).post(`/api/offers/${offerId}/comments`).send(commentData);
      const returnedComment = {...commentData, ...{id: res.body.id}};

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body).toStrictEqual(returnedComment);
    });

    test(`Create a new offer comment with status code 400 (incorrect comment data)`, async () => {
      const server = await getServer();
      const offerId = `AVvorR`;
      const commentData = {message: `New test comment`};
      const res = await request(server).post(`/api/offers/${offerId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.body).toStrictEqual({
        error: true,
        status: HttpCode.BAD_REQUEST,
        message: `Incorrect comment data sent`
      });
    });

    test(`Create a new offer comment with status code 404 (offer not found)`, async () => {
      const server = await getServer();
      const offerId = `AVvorr`;
      const commentData = {text: `New test comment`};
      const res = await request(server).post(`/api/offers/${offerId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body).toStrictEqual({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Offer with id: ${offerId} is not found`
      });
    });

  });

  describe(`Delete offer comments tests`, () => {

    test(`Delete one offer comment with status code 200`, async () => {
      const server = await getServer();
      const offerId = `AVvorR`;
      const commentId = `SSmj0h`;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(typeof (res.body)).toBe(`object`);
    });

    test(`Delete one offer comment with status code 404 (offer not found)`, async () => {
      const server = await getServer();
      const offerId = `AVvorr`;
      const commentId = `SSmj0h`;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body).toStrictEqual({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Offer with id: ${offerId} is not found`
      });
    });

    test(`Delete one offer comment with status code 404 (comment not found)`, async () => {
      const server = await getServer();
      const offerId = `AVvorR`;
      const commentId = `SSmj0H`;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body).toStrictEqual({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Comment with id: ${commentId} is not found`
      });
    });

  });

  describe(`Delete offer by id tests`, () => {

    test(`Delete offer by id with status code 200`, async () => {
      const server = await getServer();
      const offerId = `AVvorR`;
      const res = await request(server).delete(`/api/offers/${offerId}`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(typeof (res.body)).toBe(`object`);
    });

    test(`Delete offer by id with status code 404`, async () => {
      const server = await getServer();
      const offerId = `AVvorr`;
      const res = await request(server).delete(`/api/offers/${offerId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body).toStrictEqual({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Offer with id: ${offerId} is not found`
      });
    });

  });

});
