angular.module('sortApp', [])

.controller('mainController', function($scope, $http) {
  $scope.sortType     = 'change'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.searchCoin   = '';     // set the default search/filter term
  $scope.min          = 5;

  $scope.changeMin = function(m){
    $scope.min = m;
    $scope.coins = [];
    $http({
      method: 'GET',
      url: '/api?limit=' + m
    }).then(function successCallback(response) {
      $scope.coins = response.data;
    });
  }
  $scope.changeMin();

});
