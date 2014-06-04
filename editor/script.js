'use strict';

var App = angular.module('App', [
    'ngResource', 'ngRoute'
]);
App.directive('ngBooleanRadio', ngBooleanRadio);

/***
 * 
 * @param {type} param1
 * @param {type} param2
 */
App.controller('eKnightEditor', function($scope, $http) {

    $scope.showDialog = false;

    $scope.index = 0;
    $scope.list = eKnightsData;

    for (var i = 0; i < $scope.list.length; i++) {
        for (var j = 0; j < $scope.list[i].repositories.length; j++) {
//            $scope.list[i].repositories[j].main = false;
        }
    }
    $scope.next = function() {
        if ($scope.index < $scope.list.length - 1)
            $scope.index++;
    };
    $scope.prev = function() {
        if ($scope.index > 0)
            $scope.index--;
    };
    $scope.setIndex = function(idx) {
        $scope.index = idx;
    };
    $scope.hideDialog = function() {
        $scope.showDialog = false;
    };
    $scope.setMainRapoForEknight = function(eKnight, chosenOne) {
        angular.forEach(eKnight.repositories, function(repo) {
            repo.main = false;
        });
        chosenOne.main = true;
    };
    $scope.removeRepository = function(repository) {
        var indexToRemove = $scope.list[$scope.index].repositories.indexOf(repository);
        $scope.list[$scope.index].repositories.splice(indexToRemove, 1);
    };
    $scope.addRepository = function() {
        if ($scope.list[$scope.index].repositories === undefined)
            $scope.list[$scope.index].repositories = new Array();

        $scope.list[$scope.index].repositories.push({
            "name": "",
            "url": "",
            "about": ""
        }
        );
    };

    $scope.save = function() {
        window.console.log("save");
        var http_request = $http({
            method: 'POST',
            url: '/',
            data: JSON.stringify($scope.list)
        });
        http_request.success(function(data, status, headers, config) {
            if (data === 'OK') {
                $scope.showDialog = true;
            }
            window.console.log(data);
            window.console.log(status);
            window.console.log(headers);
        });

        http_request.error(function(data, status, headers, config) {
            window.console.log(data);
        });
    };

});

/***
 * 
 * @param {ngRoute.$routeProvider} $routeProvider
 */
App.config(function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'eKnightEditor',
        templateUrl: 'editor.html',
        caseInsensitiveMatch: true
    });
});