/* globals _ */
var module = angular.module('JiraStoryboard', ['ngResource',
    'ui.bootstrap',
    'ngStorage'
  ])
  .config(function ($localStorageProvider) {
    $localStorageProvider.setKeyPrefix('jiraprinter-')
  })

module.controller('ApplicationController', function ($scope, $resource, $window, $localStorage) {
  $scope.issuetype = 'Story'
  $scope.board = $localStorage.board || ''

  var IssueTypes = $resource('/issuetypes/:id')
  $scope.preferred_issuetypes = ['Story', 'Bug']
  IssueTypes.query(function (issuetypes) {
    $scope.issuetypes = _.difference(issuetypes, $scope.preferred_issuetypes)
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
      board: $scope.board.id,
      sprint: $scope.sprint.id
    }, function (issues) {
      $scope.issues = issues
    })
  }

  $scope.setType = function (type) {
    if ($scope.issuetype !== type) {
      $scope.issuetype = type
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

  $scope.listSprints()
  $scope.listIssues()
})
