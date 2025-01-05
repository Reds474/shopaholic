import request from 'sync-request-curl';
import { port, url } from './config.json';
import { BadRequestError,UnauthorisedError,ForbiddenError } from './errors.js';

export const SERVER_URL = `${url}:${port}`;

const requestHelper = (method, path, payload) => {
  let qs = {};
  let json = {};

  if (["GET", "DELETE"].includes(method)) {
    qs = payload;
  } else {
    json = payload;
  }

  const res = request(method, SERVER_URL + path, { qs, json, timeout: 20000 });
  const bodyString = res.body.toString();
  const bodyObject = {
    jsonBody: JSON.parse(bodyString),
    statusCode: res.statusCode,
  };

  return bodyObject;
};


export const addExpense = (expense, category) => {
  const url = '/expenses';
  const requestBody = {expense, category};
  return requestHelper('POST', url, requestBody);
}
