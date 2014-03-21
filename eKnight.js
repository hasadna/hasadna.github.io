

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
App.controller('eKnightCtrl', function($scope, HebUtill, commentsHandler, pieChartService, arrayUtill, $http, $routeParams) {

    $scope.pieChartService = pieChartService;

    $scope.selectedLabels = new Array();
    $scope.stateControls = {
        showIssuesWithComments: true,
        showIssuesWithOutComments: true
    };

    $scope.eKnight = _.filter(eKnightsData, function(eKnight) {
        return eKnight.slug === $routeParams.eKnight; //$sce.trustAsResourceUrl($routeParams.eKnight);
    });

    if ($scope.eKnight.length !== 0) {// TODO: 404
    }
    $scope.eKnight = $scope.eKnight[0];

    document.title = $scope.eKnight.name;

    var http_request = $http({
        method: 'GET',
        url: $scope.eKnight.issuesUrl
    });


    //http_request.error(function(data, status, headers, config) {});
    http_request.success(function(data, status, headers, config) {
        var labels = new Array();

        HebUtill.addLanguageAttribute(data);// Add title/body_lang  attribute  with hebrew Or english values - for text alignment.

        for (var i = 0; i < data.length; i++) { // Collect the labels
            data[i].timeSince = commentsHandler.timeSince(data[i].created_at);
            for (var j = 0; j < data[i].labels.length; j++) {
                labels.push(data[i].labels[j]);
            }
        }

        $scope.issues = data;

        // Count labels and remove duplicates
        $scope.labels = arrayUtill.clusterNcount(labels, 'name');


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
                return 'glyphicon-ok';

            return false;
        };

        $scope.loadComments = function(evt, issue) {
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
    });
});
