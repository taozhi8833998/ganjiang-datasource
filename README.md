# ganjiang-datasource

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e19d82a2ffec4fc4b613b8cf360bf3a1)](https://app.codacy.com/app/taozhi8833998/ganjiang-datasource?utm_source=github.com&utm_medium=referral&utm_content=taozhi8833998/ganjiang-datasource&utm_campaign=Badge_Grade_Dashboard)
[![](https://img.shields.io/badge/Powered%20by-ganjiang-brightgreen.svg)](https://github.com/taozhi8833998/ganjiang-datasource)
[![Build Status](https://travis-ci.org/taozhi8833998/ganjiang-datasource.svg?branch=master)](https://travis-ci.org/taozhi8833998/ganjiang-datasource)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/taozhi8833998/ganjiang-datasource/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/ganjiang-datasource.svg)](https://badge.fury.io/js/ganjiang-datasource)
[![NPM downloads](http://img.shields.io/npm/dm/ganjiang-datasource.svg?style=flat-square)](http://www.npmtrends.com/ganjiang-datasource)
[![Coverage Status](https://img.shields.io/coveralls/github/taozhi8833998/ganjiang-datasource/master.svg)](https://coveralls.io/github/taozhi8833998/ganjiang-datasource?branch=master)
[![Dependencies](https://img.shields.io/david/taozhi8833998/ganjiang-datasource.svg)](https://img.shields.io/david/taozhi8833998/ganjiang-datasource)
[![Known Vulnerabilities](https://snyk.io/test/github/taozhi8833998/ganjiang-datasource/badge.svg?targetFile=package.json)](https://snyk.io/test/github/taozhi8833998/ganjiang-datasource?targetFile=package.json)
[![issues](https://img.shields.io/github/issues/taozhi8833998/ganjiang-datasource.svg)](https://github.com/taozhi8833998/ganjiang-datasource/issues)

**ganjiang datasource crud sdk.**

## :star: Features

  - support ganjiang datasource crud
  - support datasource query

## :tada: Install

```bash
npm install ganjiang-datasource --save
```

## :ghost: Test

```bash
npm test
```

## :rocket: Usage

**if you want print out the debug info, please set `DEBUG='ds'` in process environment by command: `export DEBUG='ds'`**

### Init ganjiang datasource manager

```javascript

import GanJiangDataSource from 'ganjiang-datasource'

const ganjiang = new GanJiangDataSource({
  host: 'xx.xx.xx.xx', // datasource host required
  token: 'access_token' // datasource api access token optional
})

```

### Create DataSource

```javascript
const DATASOURCE_INFO = {
  name: 'test',
  host: 'host',
  port: 3306,
  database: 'database',
  user: 'user',
  password: 'password',
  db_cfg: { // 可选
    limit: 100 // 限制select最多返回100, 默认是1000
  },
  dialect: 'mysql', // optional
  token: '0123456789', // read, update, delete or query datasource need this token
  whiteList: [
    'select::null::(.*)', // db white list
  ],
  type: 1 // 0 for api, 1 for mysql 2 for psql
}
const data = await ganjiang.create(DATASOURCE_INFO) // {id: 'xxxxx'}
```

```javascript
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
const data = await ganjiang.create(API_INFO) // {id: 'xxxxx'}
```

### Get DataSource

```javascript
const opt = { // optional
  attributes: 'database,token' // get datasource and token property only
}
const data = await ganjiang.read({
  name: 'datasource name',
  token: 'datasource token'
}, opt) // DATASOURCE_INFO
```

### Update DataSource

```javascript
const num = await ganjiang.update({
  name: 'datasource name',
  token: 'datasource token'
}, updateInfo) // updateInfo would be part of DATASOURCE_INFO

// num indicates the number updated successfully
```

### Delete DataSource

```javascript
const num = await ganjiang.delete({
  name: 'datasource name',
  token: 'datasource token'
})
// num indicates the number deleted successfully
```

### Query DataSource with sql

```javascript
const data = await ganjiang.query({
  name: 'datasource name',
  token: 'datasource token'
}, {
  sql: 'sql statement'
})
```

- for dynamic values, using `values` to prevent from sql inject

```javascript
const data = await ganjiang.query({
  name: 'datasource name',
  token: 'datasource token'
}, {
  sql: 'select * from app where id = ?',
  values: [1] // select * from app where id = 1
})
```

### Request API

```javascript
const data = await ganjiang.query({
  name: 'api name',
  token: 'api token'
}, {
  query: {}, // merge with default query
  body: {},// merge with default body
  headers: {},// merge with default headers
  opt: {}// override default options
})
```

## :kissing_heart: WHILTE_LIST_AUTHORITY

you could ready more about white list in [node-sql-parser](https://www.npmjs.com/package/node-sql-parser) module

## License

[MIT](LICENSE)