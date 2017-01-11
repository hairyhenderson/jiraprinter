var Configs = require('../lib/configs')

function ConfigRouter (config, router) {
  this.config = config || {}
  this.router = router

  var visibleConfigs = null
  Object.defineProperties(this, {
    visibleConfigs: {
      get: function () {
        if (!visibleConfigs) {
          visibleConfigs = new Configs(this.config)
        }
        return visibleConfigs
      }.bind(this)
    }
  })
}

ConfigRouter.prototype.routes = function () {
  this.router.get('/', this.visibleConfigs.get.bind(this.visibleConfigs))
  return this.router
}

module.exports = ConfigRouter
