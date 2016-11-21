var Configs = require('../lib/configs')
var sinon = require('sinon')
var should = require('should')

describe('Configs', function () {
  var configs, _configs, visibleConfigs, _res, res

  beforeEach(function () {
    configs = new Configs({
      someConfig: 'ignoreMe',
      printQR: true
    })
    visibleConfigs = JSON.stringify({
      printQR: true
    })
    _configs = sinon.mock(configs)
    res = {
      status: function () {},
      send: function () {},
      end: function () {}
    }
    _res = sinon.mock(res)
  })

  afterEach(function () {
    _res.restore()
    _configs.restore()
  })

  function verifyAll () {
    _res.verify()
    _configs.verify()
  }

  describe('config', function () {
    it('yields sanitized config object', function (done) {
      configs.config(function (err, configs) {
        should.not.exist(err)

        configs.should.eql(visibleConfigs)
        verifyAll()
        done()
      })
    })
  })

  describe('get', function () {
    it('responds with config results', function (done) {
      var s = [{
        name: 'foo'
      }, {
        name: 'bar'
      }]
      _configs.expects('config').yields(null, s)
      _res.expects('send').withArgs(s)

      configs.get(null, res)
      done()
    })
  })
})
