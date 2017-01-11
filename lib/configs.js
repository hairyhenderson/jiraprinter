var util = require('util')
var Resource = require('./resource')

function Configs (options) {
  this.configs = {
    printQR: options.printQR
  }
}

util.inherits(Configs, Resource)

Configs.prototype.config = function (callback) {
  callback(null, JSON.stringify(this.configs))
}

Configs.prototype.get = function (req, res, next) {
  this.config(this._getHandler(res, next))
}

module.exports = Configs
