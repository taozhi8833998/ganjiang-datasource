# ganjiang-datasource

[![](https://img.shields.io/badge/Powered%20by-ganjiang-brightgreen.svg)](https://github.com/taozhi8833998/ganjiang-datasource)
[![Build Status](https://travis-ci.org/taozhi8833998/ganjiang-datasource.svg?branch=master)](https://travis-ci.org/taozhi8833998/ganjiang-datasource)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/taozhi8833998/ganjiang-datasource/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/ganjiang-datasource.svg)](https://badge.fury.io/js/ganjiang-datasource)
[![NPM downloads](http://img.shields.io/npm/dm/ganjiang-datasource.svg?style=flat-square)](http://www.npmtrends.com/ganjiang-datasource)
[![Coverage Status](https://img.shields.io/coveralls/github/taozhi8833998/ganjiang-datasource/master.svg)](https://coveralls.io/github/taozhi8833998/ganjiang-datasource?branch=master)
[![Dependencies](https://img.shields.io/david/taozhi8833998/ganjiang-datasource.svg)](https://img.shields.io/david/taozhi8833998/ganjiang-datasource)
[![issues](https://img.shields.io/github/issues/taozhi8833998/ganjiang-datasource.svg)](https://github.com/taozhi8833998/ganjiang-datasource/issues)


**ganjiang datasource crud sdk.**

## :star: Features

- support ganjiang datasource crud
- support datasource query

## :tada: Install

```bash
npm install ganjiang-datasource --save
```
## :rocket: Usage

### init ganjiang datasource manager

```javascript
import GanJiangDataSource from 'ganjiang-datasource

const ganjiang = new GanJiangDataSource({
  host: 'xx.xx.xx.xx', // datasource host required
  token: 'access_token' // datasource api access token optional
})
```

### create datasource

```javascript
const DATASOURCE_INFO = {
  name: 'test',
  host: 'host',
  port: 3306,
  database: 'database',
  user: 'user',
  password: 'password',
  dialect: 'mysql', // optional
  token: '0123456789', // read, update, delete or query datasource need this token
  whiteList: [
    'select::null::(.*)', // db white list
  ],
  type: 1 // 1 for mysql
}
const data = await ganjiang.create(DATASOURCE_INFO) // {id: 'xxxxx'}
```

### get datasource

```javascript
const data = await ganjiang.read({
  name: 'datasource name',
  token: 'datasource token'
}) // DATASOURCE_INFO
```

### update datasource

```javascript
const num = await ganjiang.update({
  name: 'datasource name',
  token: 'datasource token'
}, updateInfo) // updateInfo would be part of DATASOURCE_INFO

// num indicates the number updated successfully
```

### delete datasource

```javascript
const num = await ganjiang.delete({
  name: 'datasource name',
  token: 'datasource token'
})
// num indicates the number deleted successfully
```

### query datasource with sql

```javascript
const data = await ganjiang.query({
  name: 'datasource name',
  token: 'datasource token'
}, {
  sql: 'sql statement'
})
```

## :kissing_heart: WHILTE_LIST_AUTHORITY

you could ready more about white list in [node-sql-parser](https://www.npmjs.com/package/node-sql-parser) module

## License

[MIT](LICENSE)

