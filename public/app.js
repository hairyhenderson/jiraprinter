/* globals _ */
var module = angular.module('JiraStoryboard', ['ngResource',
  'ui.bootstrap',
  'ngStorage'
])
  .config(function ($localStorageProvider) {
    $localStorageProvider.setKeyPrefix('jiraprinter-')
  })

module.controller('ApplicationController', function ($scope, $resource, $window, $localStorage, $http) {
  $scope.board = $localStorage.board || ''
  $scope.filter = $localStorage.filter || ''

  $scope.getConfigs = function () {
    $http.get('/configs').then(function (response) {
      $scope.configs = {
        printQR: response.data.printQR
      }
    })
  }

  var IssueTypes = $resource('/issuetypes/:id')
  $scope.supported_apis = ['Filters', 'Boards']
  $scope.apiType = $scope.supported_apis[0]
  $scope.preferred_issuetypes = ['Story', 'Bug']
  $scope.issuetype = $scope.preferred_issuetypes[0]
  IssueTypes.query(function (issuetypes) {
    $scope.issuetypes = _.difference(issuetypes, $scope.preferred_issuetypes)
  })

  var Filters = $resource('/filters/:id')
  Filters.query(function (filters) {
    $scope.filters = filters
  })

  var Boards = $resource('/boards/:id')
  Boards.query(function (boards) {
    $scope.boards = boards
  })

  var Sprints = $resource('/sprints/:id')
  $scope.preferred_sprints = [{
    id: 'openSprints()',
    name: 'Current sprints'
  }, {
    id: 'futureSprints()',
    name: 'Future sprints (not backlog)'
  }, {
    id: 'closedSprints()',
    name: 'Previous sprints'
  }]
  $scope.sprint = $localStorage.sprint || $scope.preferred_sprints[0]
  $scope.listSprints = function () {
    $scope.sprints = null
    Sprints.query({
      boardId: $scope.board.id
    }, function (sprints) {
      $scope.sprints = _.difference(sprints, $scope.preferred_sprints)
    })
  }

  var Issue = $resource('/issues/:id')
  $scope.listIssues = function () {
    $scope.issues = null
    Issue.query({
      issuetype: $scope.issuetype,
      jql: $scope.filter.jql,
      board: $scope.board.id,
      sprint: $scope.sprint.id
    }, function (issues) {
      $scope.issues = issues
    })
  }

  $scope.setApi = function (api) {
    $scope.apiType = api
  }

  $scope.setType = function (type) {
    if ($scope.issuetype !== type) {
      $scope.issuetype = type
      $scope.listIssues()
    }
  }

  $scope.setFilter = function (filter) {
    if ($scope.filter !== filter) {
      $localStorage.filter = filter
      $scope.filter = filter
      $scope.listIssues()
    }
  }
  $scope.setBoard = function (board) {
    if ($scope.board !== board) {
      $localStorage.board = board
      $scope.board = board
      $scope.listIssues()
      $scope.listSprints()
    }
  }

  $scope.setSprint = function (sprint) {
    if ($scope.sprint !== sprint) {
      $localStorage.sprint = sprint
      $scope.sprint = sprint
      $scope.listIssues()
    }
  }

  $scope.getConfigs()
  $scope.listSprints()
  $scope.listIssues()
})
