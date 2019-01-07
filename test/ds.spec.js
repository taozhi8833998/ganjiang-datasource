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
  const id = '5c3353ca4183100c96ed8c1e'
  const DATASOURCE_INFO = {
    name: 'test',
    host: 'host',
    port: 3306,
    database: 'database',
    user: 'user',
    password: 'password',
    dialect: 'mysql',
    token: '0123456789',
    whiteList: [
      'select::null::(.*)',
    ],
    type: 1
  }
  describe('host is required', () => {
    it('show throw error', () => {
      try {
        new GanJiangDataSource()
      } catch(err) {
        expect(err.message).to.be.eql('host is required to initialize instance')
      }
    })
  })
  describe('create, read, update, delete and query datasource successfully', () => {
    before(() => {
      const url = `http://${host}`
      const headers = {
        reqheaders: {
          'Content-Type': 'application/json',
          token,
        },
      }
      nock(url, headers)
        .post('/v1/admin/ds', DATASOURCE_INFO)
        .reply(200, {
          isError: false,
          data: {
            id
          }
        })
      headers.reqheaders.ds_token = DATASOURCE_INFO.token
      nock(url, headers)
        .get(`/v1/admin/ds/${DATASOURCE_INFO.name}`)
        .reply(200, {
          isError: false,
          data: {
            ...DATASOURCE_INFO,
            whiteList:[
              ...DATASOURCE_INFO.whiteList,
              'select::information_schema::(.*)'
            ],
            gmt_modified: "2019-01-07T14:16:45.105Z",
            gmt_created:  "2019-01-07T14:16:45.105Z",
            id: null,
          }
        })
      nock(url, headers)
        .put(`/v1/admin/ds/${DATASOURCE_INFO.name}`, { whiteList: ['select::null::a'] })
        .reply(200, {
          isError: false,
          data: 1
        })
      nock(url, headers)
        .delete(`/v1/admin/ds/${DATASOURCE_INFO.name}`)
        .reply(200, {
          isError: false,
          data: 1
        })
      headers.reqheaders['accept-encoding'] = 'gzip'
      nock(url, headers)
        .post(`/v1/data/${DATASOURCE_INFO.name}`, {
          sql: 'select * from app limit 0, 2'
        })
        .reply(200, {
          isError: false,
          data: [
            {
              app: 'test'
            },
            {
              app: 'test2'
            }
          ]
        })
    })
    it('create', done(async () => {
      const dataSource = await ganjiang.create(DATASOURCE_INFO)
      expect(dataSource).to.be.eql({id})
    }))
    it('read', done(async () => {
      const dataSource = await ganjiang.read({
        name: DATASOURCE_INFO.name,
        token: DATASOURCE_INFO.token
      })
      expect(dataSource).to.be.eql({
        ...DATASOURCE_INFO,
        whiteList: [
          ...DATASOURCE_INFO.whiteList,
          'select::information_schema::(.*)'
        ],
        gmt_modified: "2019-01-07T14:16:45.105Z",
        gmt_created: "2019-01-07T14:16:45.105Z",
        id: null,
      })
    }))
    it('update', done(async () => {
      const num = await ganjiang.update({
        name: DATASOURCE_INFO.name,
        token: DATASOURCE_INFO.token
      }, {
        whiteList: ['select::null::a']
      })
      expect(num).to.be.eql(1)
    }))
    it('delete', done(async () => {
      const num = await ganjiang.delete({
        name: DATASOURCE_INFO.name,
        token: DATASOURCE_INFO.token
      }, {
          database: 'new-database'
        })
      expect(num).to.be.eql(1)
    }))
    it('query', done(async () => {
      const data  = await ganjiang.query({
        name: DATASOURCE_INFO.name,
        token: DATASOURCE_INFO.token
      }, {
        sql: 'select * from app limit 0, 2'
      })
      expect(data).to.be.eql([
        {
          app: 'test'
        },
        {
          app: 'test2'
        }
      ])
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
        .post('/v1/admin/ds', DATASOURCE_INFO)
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
        .post(`/v1/data/${DATASOURCE_INFO.name}`, {
          sql: 'select * from app limit 0, 2'
        })
        .reply(200, {
          isError: true,
          error
        })
    })
    it('create', done(async () => {
      try {
        await ganjiang.create(DATASOURCE_INFO)
      } catch(err) {
        expect(err).to.be.eql(error)
      }
    }))
    it('query', done(async () => {
      try {
        await ganjiang.query({
          name: DATASOURCE_INFO.name,
          token: DATASOURCE_INFO.token
        }, {
            sql: 'select * from app limit 0, 2'
          })
      } catch (err) {
        expect(err).to.be.eql(error)
      }
    }))
  })
})
