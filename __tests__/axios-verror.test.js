/*
 * Copyright 2022 Centrapay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const AxiosVError = require('../axios-verror');
const nock = require('nock');
const axios = require('axios');
const VError = require('verror');

describe('enhance', () => {

  test('basic', async () => {
    nock('http://nock')
      .post('/')
      .reply(400, { message: 'invalid request' });
    let caught = null;
    try {
      await axios.request({
        url: 'http://nock/',
        method: 'POST',
        data: { param: 'foo' },
      }).catch(AxiosVError.enhance);
    } catch (e) {
      caught = e;
    }
    expect(caught.message).toEqual(
      '[400] POST http://nock/ (invalid request): Request failed with status code 400'
    );
    expect(VError.info(caught)).toEqual({
      axios: {
        res: caught.jse_cause.response,
        message: 'invalid request',
        method: 'POST',
        status: 400,
        url: 'http://nock/',
      }
    });
  });

  test('query params', async () => {
    nock('http://nock')
      .get('/')
      .query({ foo: 1 })
      .reply(400, { message: 'invalid request' });
    let caught = null;
    try {
      await axios.request({
        url: 'http://nock/',
        method: 'GET',
        params: { foo: 1 },
      }).catch(AxiosVError.enhance);
    } catch (e) {
      caught = e;
    }
    expect(caught.message).toEqual(
      '[400] GET http://nock/ (invalid request): Request failed with status code 400'
    );
    expect(VError.info(caught)).toEqual({
      axios: {
        res: caught.jse_cause.response,
        message: 'invalid request',
        method: 'GET',
        status: 400,
        url: 'http://nock/',
      }
    });
  });

  test('only base url', async () => {
    nock('http://nock')
      .get('/')
      .reply(400, { message: 'invalid request' });
    let caught = null;
    const client = axios.create({
      baseURL: 'http://nock',
    });
    try {
      await client.request({
        method: 'GET',
      }).catch(AxiosVError.enhance);
    } catch (e) {
      caught = e;
    }
    expect(caught.message).toEqual(
      '[400] GET http://nock/ (invalid request): Request failed with status code 400'
    );
    expect(VError.info(caught)).toEqual({
      axios: {
        res: caught.jse_cause.response,
        message: 'invalid request',
        method: 'GET',
        status: 400,
        url: 'http://nock/',
      }
    });
  });

  test('base url and path', async () => {
    nock('http://nock')
      .get('/foo')
      .reply(400, { message: 'invalid request' });
    let caught = null;
    const client = axios.create({
      baseURL: 'http://nock',
    });
    try {
      await client.request({
        url: 'foo',
        method: 'GET',
      }).catch(AxiosVError.enhance);
    } catch (e) {
      caught = e;
    }
    expect(caught.message).toEqual(
      '[400] GET http://nock/foo (invalid request): Request failed with status code 400'
    );
    expect(VError.info(caught)).toEqual({
      axios: {
        res: caught.jse_cause.response,
        message: 'invalid request',
        method: 'GET',
        status: 400,
        url: 'http://nock/foo',
      }
    });
  });

});
