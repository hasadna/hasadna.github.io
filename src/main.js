'use strict';

var App = angular.module('App', [
    'ngResource', 'ngRoute', 'ngSanitize', 'ui.utils', 'App.filters',
    'HebUtill', 'commentsHandler', 'arrayUtill', 'checkboxesFilter','issuesLoader'
]);


/***
 * 
 * @param {ngRoute.$routeProvider} $routeProvider
 */
App.config(function($routeProvider) {

    $routeProvider.when('/:eKnight/piChart', {
        controller: 'piChartCtrl',
        templateUrl: 'visualizations/piVisualization/index.html',
        caseInsensitiveMatch: true
    });
    $routeProvider.when('/all-issues', {
        controller: 'allIssuesCtrl',
        templateUrl: 'all-issues/list.html',
        caseInsensitiveMatch: true
    });
    $routeProvider.when('/:eKnight', {
        controller: 'eKnightCtrl',
        templateUrl: 'templates/list.html',
        caseInsensitiveMatch: true
    });
    $routeProvider.when('/', {
        controller: 'indexCtrl',
        templateUrl: 'main-page/index.html',
        caseInsensitiveMatch: true
    });
//    $routeProvider.otherwise({
//        redirectTo: '/'
//    });
});