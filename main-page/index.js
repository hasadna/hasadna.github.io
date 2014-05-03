

/***
 * 
 * @param {type} param1
 * @param {type} param2
 */
App.controller('indexCtrl', function($scope, $window) {

    $scope.eKnights = $window.eKnightsData;
    $scope.small_repos = $window.small_repos;


});
