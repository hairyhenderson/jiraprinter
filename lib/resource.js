var url = require('url')
var util = require('util')

function Resource () {
}

Resource.prototype._resourceResponseHandler = function (filter, callback) {
  return function (err, res, body) {
    this._handleResponse(err, res, body, function (err, body) {
      if (err) {
        return callback(err)
      }
      callback(err, filter.call(this, body))
    })
  }.bind(this)
}

Resource.prototype._handleResponse = function (err, res, body, callback) {
  if (err) {
    console.error(err)
    return callback(err)
  }
  if (res.statusCode > 399) {
    var msg = util.format('got status %s while %sing to %s', res.statusCode, res.request.method, url.format(res.request.uri))
    console.error(msg)
    return callback({
      message: msg,
      statusCode: res.statusCode,
      method: res.request.method,
      body: body
    })
  }

  callback(err, body)
}

Resource.prototype._getHandler = function (res, next) {
  return function (err, resource) {
    if (err && err.statusCode) {
      return res.status(502).send(err)
    } else if (err) {
      return next(err)
    }
    return res.send(resource)
  }
}

module.exports = Resource
