/* globals _ */
var module = angular.module('JiraStoryboard', ['ngResource', 'ui.bootstrap'])

module.controller('ApplicationController', function ($scope, $resource, $window) {
  $scope.issuetype = 'Story'
  var IssueTypes = $resource('/issuetypes/:id')
  $scope.preferred_issuetypes = ['Story', 'Bug']
  IssueTypes.query(function (issuetypes) {
    $scope.issuetypes = _.difference(issuetypes, $scope.preferred_issuetypes)
  })

  var Issue = $resource('/issues/:id')
  $scope.listIssues = function () {
    $scope.issues = null
    Issue.query({
      issuetype: $scope.issuetype
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

  $scope.listIssues()
})
