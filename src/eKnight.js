

App.filter('trust', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
});


/***
 * 
 * @param {type} param1
 * @param {type} param2
 */
App.controller('eKnightCtrl', function($scope, HebUtill, issuesLoader, commentsHandler, pieChartService, arrayUtill, $http, $routeParams) {

    $scope.pieChartService = pieChartService;

    $scope.selectedLabels = new Array();
    $scope.stateControls = {
        showIssuesWithComments: true,
        showIssuesWithOutComments: true
    };

    $scope.eKnight = _.filter(eKnightsData, function(eKnight) {
        return eKnight.slug === $routeParams.eKnight;
    });

    if ($scope.eKnight.length !== 0) {// TODO: 404
    }
    $scope.eKnight = $scope.eKnight[0];

    document.title = $scope.eKnight.name;



    issuesLoader.load($scope.eKnight.repositories, function(data, labels) {




        $scope.issues = data;

        $scope.labels = labels;


        $scope.updateState = function() {
            //debugger;$scope.stateControls = $scope.stateControls;
            $scope.$apply();
        };

        $scope.setSelectedLabels = function() {
            var name = this.lbl.name;
            if (_.contains($scope.selectedLabels, name))
                $scope.selectedLabels = _.without($scope.selectedLabels, name);
            else
                $scope.selectedLabels.push(name);

            return false;
        };

        $scope.isChecked = function(name) {
            if (_.contains($scope.selectedLabels, name))
                return 'fa-check';
            return false;
        };

        $scope.loadComments = function(evt, issue) {

            $scope.readMore(evt, issue);
            var http_request = $http({
                method: 'GET',
                url: issue.comments_url
            });
            http_request.success(function(data, status, headers, config) {
                var comments_list = new Array();

                function loadComments(i) {
                    if (i === -1) {
                        commentsHandler.treatComments(comments_list);
                        //  window.console.clear();
                        // window.console.log(JSON.stringify(comments_list));
                        issue.comments_list = comments_list;
                        return;
                    }
                    var comment_request = $http({
                        method: 'GET',
                        url: data[i].url
                    });
                    comment_request.success(function(comment, status, headers, config) {
                        comments_list.push(comment);
                        i--;
                        loadComments(i);
                    });
                }
                loadComments(data.length - 1);
            });
        };

        $scope.readMore = function(evt, issue) {
            issue.textLimit = 1000000;
        };
    });
});
