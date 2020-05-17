'use strict';

const request = require(`supertest`);
const {getServer} = require(`../api-server/api-server`);
const {HttpCode} = require(`../service-constants`);

describe(`Search API end-to-end tests`, () => {

  test(`Get empty offers array with status code 200`, async () => {
    const server = await getServer();
    const res = await request(server).get(`/api/search`).query({query: `луна`});
    expect(res.statusCode).toBe(HttpCode.SUCCESS);
    expect(res.body).toEqual([]);
  });

  test(`Get searched offers array with status code 200`, async () => {
    const server = await getServer();
    const res = await request(server).get(`/api/search`).query({query: `Продам`});

    expect(res.statusCode).toBe(HttpCode.SUCCESS);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test(`Search ends with status code 400`, async () => {
    const server = await getServer();
    const res = await request(server).get(`/api/search`).query({param: `Продам`});

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(res.body).toStrictEqual({
      error: true,
      status: HttpCode.BAD_REQUEST,
      message: `Incorrect data sent`
    });
  });
});
