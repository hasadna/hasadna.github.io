'use strict';

var App = angular.module('App', [
    'ngResource', 'ngRoute', 'ngSanitize', 'ui.utils', 'App.filters',
    'HebUtill', 'commentsHandler', 'arrayUtill', 'checkboxesFilter', 'issuesLoader', 'timeUtill'
]);


/**
 * 
 * @param {ngRoute.$routeProvider} $routeProvider
 */
App.config(function($routeProvider) {

    var path = window.CONFIG.PATH;

    $routeProvider.when('/:eKnight/piChart', {
        controller: 'piChartCtrl',
        templateUrl: path + 'visualizations/piVisualization/index.html',
        caseInsensitiveMatch: true
    });
    $routeProvider.when('/all-issues', {
        controller: 'allIssuesCtrl',
        templateUrl: path + 'all-issues/list.html',
        caseInsensitiveMatch: true
    });
    $routeProvider.when('/:eKnight', {
        controller: 'eKnightCtrl',
        templateUrl: path + 'templates/list.html',
        caseInsensitiveMatch: true
    });
    $routeProvider.when('/', {
        controller: 'indexCtrl',
        templateUrl: path + 'main-page/index.html',
        caseInsensitiveMatch: true
    });
//$routeProvider.otherwise({redirectTo: '/'});
});