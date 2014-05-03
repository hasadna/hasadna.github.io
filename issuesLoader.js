

angular.module('issuesLoader', [
]).factory('issuesLoader', function($http, commentsHandler, arrayUtill) {
    /**
     * https://developer.github.com/v3/issues
     * @constructor
     */
    var issuesLoader = function() {

        function getIssuesURL(repoURL) {
            var startOfRepoName = repoURL.lastIndexOf("/") + 1;
            var repoName = repoURL.substring(startOfRepoName, repoURL.length);
            if (repoURL.indexOf('hasadna') === -1) {
                var userName = repoURL.substring(0, startOfRepoName - 1);
                userName = userName.substring(userName.lastIndexOf("/") + 1, userName.length);

                return "https://api.github.com/repos/" + userName + "/" + repoName + "/issues";
            }

            return "https://api.github.com/repos/hasadna/" + repoName + "/issues";
        }

        this.load = function(reposArr, cb) {
            var issues_list = new Array();

            function loadIssues(i) {
                if (i === -1) {
                    processIssues(issues_list, cb);
                    return;
                }
                var comment_request = $http({
                    method: 'GET',
                    url: getIssuesURL(reposArr[i].url)
                });
                comment_request.success(function(comment, status, headers, config) {
                    issues_list = issues_list.concat(comment);
                    i--;
                    loadIssues(i);
                });
                // Sometimes  Issues are disabled..
                comment_request.error(function(data, status, headers, config) {
                    i--;
                    loadIssues(i);
                });

            }

            loadIssues(reposArr.length - 1);
        };

        function processIssues(data, cb) {
            var labels = new Array();

            commentsHandler.treatComments(data);// Add title/body_lang  attribute  with hebrew Or english values - for text alignment.

            for (var i = 0; i < data.length; i++) { // Collect the labels
                data[i].textLimit = 30;
                for (var j = 0; j < data[i].labels.length; j++) {
                    labels.push(data[i].labels[j]);
                }
            }
            labels = arrayUtill.clusterNcount(labels, 'name');
            cb(data, labels);
        }
    };
    return new issuesLoader();
});
