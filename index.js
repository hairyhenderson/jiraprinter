'use strict';

// Set these options first!
var config = {
  host: 'UNSET.atlassian.net',
  port: '443',
  user: 'UNSET',
  password: 'UNSET'
}

var request = require('request')
var async = require('async')
var express = require('express')
var app = express()

var filterId = 12708
var searchUrl

function getSearchUrl(callback) {
  if (!!searchUrl) {
    callback(null, searchUrl)
  } else {
    request.get('https://' + config.host + '/rest/api/latest/filter/' + filterId, {
      auth: {
        user: config.user,
        password: config.password
      },
      json: true
    }, function(err, res, body) {
      if (err) throw err
      if (err || res.statusCode != 200) {
        callback(err)
      } else {
        searchUrl = body.searchUrl
        callback(null, searchUrl)
      }
    })
  }
}

app.get('/stories', function(req, res, next) {
  async.waterfall([
    getSearchUrl,
    function search(url, callback) {
      request.get(url, {
        auth: {
          user: config.user,
          password: config.password
        },
        json: true
      }, function(err, res, body) {
        async.map(body.issues, function(issue, callback) {
            callback(null, {
              name: issue.fields.issuetype.name,
              key: issue.key,
              priority: issue.fields.priority.name,
              summary: issue.fields.summary,
              status: issue.fields.status.name,
              url: 'https://' + config.host + '/browse/' + issue.key
            })
          }, callback)
      })
    }
  ], function(err, stories) {
    if (err) return next(err)

    res.send(stories)
  })
})

app.use(express.static('public'))

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('jiraprinter listening at http://%s:%s', host, port);
})
