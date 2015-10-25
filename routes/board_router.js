var Board = require('../lib/boards')

function BoardRouter (config, router) {
  this.config = config || {}
  this.router = router

  /* eslint-disable */
  var boards = null
  Object.defineProperties(this, {
    boards: {
      set: function (s) {
        boards = s
      },
      get: function () {
        if (!boards) {
          boards = new Board(this.config)
        }
        return boards
      }.bind(this)
    }
  })
/* eslint-enable */
}

BoardRouter.prototype.routes = function () {
  this.router.get('/', this.boards.get.bind(this.boards))
  return this.router
}

module.exports = BoardRouter
