'use strict';

const request = require(`supertest`);
const {getServer} = require(`../api-server`);
const {getMockData} = require(`../lib/get-mock-data`);
const {HttpCode} = require(`../service-constants`);

let server;
let mockData;

beforeAll(async () => {
  server = await getServer();
  mockData = await getMockData();
});

describe(`Search API end-to-end tests`, () => {

  test(`Get empty offers array with status code 200`, async () => {
    const res = await request(server).get(`/api/search`).query({query: `Тестовый текст поиска предложения`});
    expect(res.statusCode).toBe(HttpCode.SUCCESS);
    expect(res.body.length).toBe(0);
  });

  test(`Get searched offers array with status code 200`, async () => {
    const res = await request(server).get(`/api/search`).query({query: mockData[0].title});

    expect(res.statusCode).toBe(HttpCode.SUCCESS);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`Search ends with status code 400`, async () => {
    const res = await request(server).get(`/api/search`).query({param: `Продам`});

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(res.body.error).toBeTruthy();
    expect(res.body.status).toBe(HttpCode.BAD_REQUEST);
  });
});
