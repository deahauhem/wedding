'use strict';

angular.module('BlankApp', ['ngMaterial'])
.controller('AppCtrl', function($scope, $mdSidenav) {
  $scope.toggle = function(){
    $mdSidenav('left-nav').toggle();
  }
})
.config(function($mdThemingProvider, $mdIconProvider) {
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdIconProvider.iconSet('navigation', "bower_components/material-design-icons/navigation", 24)
});
