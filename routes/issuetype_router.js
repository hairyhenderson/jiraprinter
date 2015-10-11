var IssueTypes = require('../lib/issuetypes')

function IssueTypeRouter (config, router) {
  this.config = config || {}
  this.router = router

  /* eslint-disable */
  var issuetypes = null
  Object.defineProperties(this, {
    issuetypes: {
      set: function (s) {
        issuetypes = s
      },
      get: function () {
        if (!issuetypes) {
          issuetypes = new IssueTypes(this.config)
        }
        return issuetypes
      }.bind(this)
    }
  })
/* eslint-enable */
}

IssueTypeRouter.prototype.routes = function () {
  this.router.get('/', this.issuetypes.get.bind(this.issuetypes))
  return this.router
}

module.exports = IssueTypeRouter
