var module = angular.module('JiraStoryboard', ['ngResource']);

module.controller('ApplicationController', function($scope, $resource) {
  var Story = $resource('/stories/:id')
  Story.query(function(stories) {
    $scope.stories = stories
  })
})
