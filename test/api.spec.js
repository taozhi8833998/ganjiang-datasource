const { expect } = require('chai')
const nock = require('nock')
const done = require('./util')
const GanJiangDataSource = require('../lib').default

describe('ganjiang datasource crud', () => {
  const host = 'localhost:8000'
  const token = '1234567890'
  const ganjiang = new GanJiangDataSource({
    host,
    token
  })
  const id = '5cac6e0a70a888001f2ca937'
  const API_INFO = {
    name: 'api_test',
    url: 'http://xxx.xxx.xx.xx/url/path',
    method: 'get',
    token: '0123456789',
    headers: {}, // default headers
    query: {}, // default query
    body: {}, // default body
    type: 0
  }
  const opt = {
    name: API_INFO.name,
    token: API_INFO.token
  }
  describe('create, read, update, delete and query api successfully', () => {
    before(() => {
      const url = `http://${host}`
      const headers = {
        reqheaders: {
          'Content-Type': 'application/json',
          token,
        },
      }
      nock(url, headers)
        .post('/v1/admin/ds', API_INFO)
        .reply(200, {
          isError: false,
          data: {
            id
          }
        })
      headers.reqheaders.ds_token = API_INFO.token
      nock(url, headers)
        .get(`/v1/admin/ds/${API_INFO.name}`)
        .reply(200, {
          isError: false,
          data: {
            ...API_INFO,
            whiteList: [
              'select::information_schema::(.*)'
            ],
            gmt_modified: "2019-01-07T14:16:45.105Z",
            gmt_created: "2019-01-07T14:16:45.105Z",
            id: null,
          }
        })
      nock(url, headers)
        .get(`/v1/admin/ds/${API_INFO.name}`)
        .query({ attributes: 'name,url' })
        .reply(200, {
          isError: false,
          data: {
            name: API_INFO.name,
            url: API_INFO.url,
            id: null,
          }
        })
      nock(url, headers)
        .put(`/v1/admin/ds/${API_INFO.name}`, { method: 'post' })
        .reply(200, {
          isError: false,
          data: 1
        })
      nock(url, headers)
        .delete(`/v1/admin/ds/${API_INFO.name}`)
        .reply(200, {
          isError: false,
          data: 1
        })
      headers.reqheaders['accept-encoding'] = 'gzip'
      nock(url, headers)
        .post(`/v1/data/${API_INFO.name}`, {
          body: {
            name: 'test'
          }
        })
        .reply(200, {
          isError: false,
          data: {
            name: 'test'
          }
        })
      nock(url, headers)
        .post(`/v1/data/${API_INFO.name}`)
        .reply(200, {
          isError: false,
          data: 'OK'
        })
    })
    it('create', done(async () => {
      const dataSource = await ganjiang.create(API_INFO)
      expect(dataSource).to.be.eql({ id })
    }))
    it('read', done(async () => {
      const dataSource = await ganjiang.read(opt)
      expect(dataSource).to.be.eql({
        ...API_INFO,
        whiteList: [
          'select::information_schema::(.*)'
        ],
        gmt_modified: "2019-01-07T14:16:45.105Z",
        gmt_created: "2019-01-07T14:16:45.105Z",
        id: null,
      })
    }))
    it('read with attributes', done(async () => {
      const query = {
        attributes: 'name,url'
      }
      const dataSource = await ganjiang.read(opt, query)
      expect(dataSource).to.be.eql({
        name: API_INFO.name,
        url: API_INFO.url,
        id: null,
      })
    }))
    it('update', done(async () => {
      const num = await ganjiang.update(opt, {
          method: 'post'
        })
      expect(num).to.be.eql(1)
    }))
    it('delete', done(async () => {
      const num = await ganjiang.delete(opt)
      expect(num).to.be.eql(1)
    }))
    it('query', done(async () => {
      const data = await ganjiang.query(opt)
      expect(data).to.be.eql('OK')
    }))
    it('query with values', done(async () => {
      const data = await ganjiang.query(opt, {
        body: {
          name: 'test'
        }
      })
      expect(data).to.be.eql({
        name: 'test'
      })
    }))
  })
  describe('crud and query datasource error', () => {
    const error = {
      message: 'test error',
      code: 'TEST_ERROR',
      statusCode: 400
    }
    before(() => {
      nock(`http://${host}`, {
        reqheaders: {
          'Content-Type': 'application/json',
          token,
        },
      })
        .post('/v1/admin/ds', API_INFO)
        .reply(400, {
          isError: true,
          error
        })

      nock(`http://${host}`, {
        reqheaders: {
          'Content-Type': 'application/json',
          token,
        },
      })
        .post(`/v1/data/${API_INFO.name}`)
        .reply(200, {
          isError: true,
          error
        })
    })
    it('create', done(async () => {
      try {
        await ganjiang.create(API_INFO)
      } catch (err) {
        expect(err).to.be.eql(error)
      }
    }))
    it('query', done(async () => {
      try {
        await ganjiang.query(opt)
      } catch (err) {
        expect(err).to.be.eql(error)
      }
    }))
  })
})
