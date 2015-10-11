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
    // TODO: load this from some persistent source...
  $scope.project = $localStorage.project || ''

  var IssueTypes = $resource('/issuetypes/:id')
  $scope.preferred_issuetypes = ['Story', 'Bug']
  IssueTypes.query(function (issuetypes) {
    $scope.issuetypes = _.difference(issuetypes, $scope.preferred_issuetypes)
  })

  var Projects = $resource('/projects/:id')
  Projects.query(function (projects) {
    $scope.projects = projects
  })

  var Issue = $resource('/issues/:id')
  $scope.listIssues = function () {
    $scope.issues = null
    Issue.query({
      issuetype: $scope.issuetype,
      project: $scope.project
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

  $scope.setProject = function (project) {
    if ($scope.project !== project) {
      $localStorage.project = project
      $scope.project = project
      $scope.listIssues()
    }
  }

  $scope.listIssues()
})
