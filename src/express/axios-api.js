'use strict';

const axios = require(`axios`);

const createAPI = () => {
  const api = axios.create({
    baseURL: `http://localhost:3000/api`,
    timeout: 5000
  });

  const onSuccess = (response) => {
    return response.data;
  };

  const onFail = (err) => {
    throw err;
  };

  api.interceptors.response.use(onSuccess, onFail);

  return api;
};

module.exports = {createAPI};
