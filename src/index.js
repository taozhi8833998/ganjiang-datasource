import axios from 'axios'
import Debug from 'debug'
import mysql from 'mysql'

const debug = Debug('ds')
const SYMBOL_PROPETY = {
  requestDataSource : Symbol('requestDataSource'),
}

class DataSource {
  constructor({ host, token } = {}) {
    if (!host) throw new Error('host is required to initialize instance')
    this.host = host
    this.token = token
  }

  create(body) {
    return this[SYMBOL_PROPETY.requestDataSource]({
      method : 'POST',
      url    : '/v1/admin/ds',
      body,
    })
  }

  read({ name, token }, query) {
    return this[SYMBOL_PROPETY.requestDataSource]({
      method  : 'GET',
      url     : `/v1/admin/ds/${name}`,
      headers : {
        ds_token : token,
      },
      query,
    })
  }

  update({ name, token }, body) {
    return this[SYMBOL_PROPETY.requestDataSource]({
      method  : 'PUT',
      url     : `/v1/admin/ds/${name}`,
      body,
      headers : {
        ds_token : token,
      },
    })
  }

  delete({ name, token }) {
    return this[SYMBOL_PROPETY.requestDataSource]({
      method  : 'DELETE',
      url     : `/v1/admin/ds/${name}`,
      headers : {
        ds_token : token,
      },
    })
  }

  query({ name, token }, body) {
    if (body.values) {
      body.sql = mysql.format(body.sql, body.values)
      Reflect.deleteProperty(body, 'values')
    }
    return this[SYMBOL_PROPETY.requestDataSource]({
      method  : 'POST',
      url     : `/v1/data/${name}`,
      body,
      headers : {
        'accept-encoding' : 'gzip',
        ds_token          : token,
      },
    })
  }

  async [SYMBOL_PROPETY.requestDataSource](options) {
    const { url, method = 'get', body = {}, query = {}, headers = {} } = options
    const opt = {
      method,
      url     : `http://${this.host}${url}`,
      params  : query,
      data    : body,
      headers : {
        'Content-Type' : 'application/json',
        token          : this.token,
        ...headers,
      },
      withCredentials : false,
      responseType    : 'json',
    }
    debug('request opt=', opt)
    try {
      const res = await axios(opt)
      const { isError, data, error } = res.data
      debug('datasource response isError=', isError)
      if (isError) throw error
      return data
    } catch(err) {
      const responseError = err.response && err.response.data && err.response.data.error
      const error = responseError || err
      const info = `request to datasource error, the error is ${error.message}`
      debug(`${info}, the stack is = ${err.stack}, the error = %O`, error)
      throw error
    }
  }
}

export default DataSource
