var Issues = require('../lib/issues')

function IssueRouter (config, router) {
  this.config = config || {}
  this.router = router

  // Here be dragons 🐉🐲
  // We just want to lazy-load the /issues handler to make testing a bit easier
  /* eslint-disable */
  var issues = null
  Object.defineProperties(this, {
    issues: {
      set: function (s) {
        issues = s
      },
      get: function () {
        if (!issues) {
          issues = new Issues(this.config)
        }
        return issues
      }.bind(this)
    }
  })
/* eslint-enable */
}

IssueRouter.prototype.routes = function () {
  this.router.get('/', this.issues.get.bind(this.issues))
  return this.router
}

module.exports = IssueRouter
