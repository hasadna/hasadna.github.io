
angular.module('App.filters', []).filter('githubTagsFilter', [
    function() {

        /***
         * @description Filter issues by labels.
         * @param {Array<Object>} issues
         * @param {Array<string>} selectedLabels
         * @returns {Array} of issues.
         */
        return function(issues, selectedLabels) {
            if (selectedLabels === undefined)
                return issues;
            else if (issues === undefined)
                return issues;
            var tempIssues = new Array();

//showIssuesWithComments

            if (selectedLabels.length > 0)// Do we need to filter?
            {

                for (var j = 0; j < issues.length; j++) { // for each issue
                    var issue_labels = new Array();

                    // Get all the names of the labels into issue_labels
                    for (var i = 0; i < issues[j].labels.length; i++)
                        issue_labels.push(issues[j].labels[i].name);

                    // If all the selectedLabels appears in issue_labels add it to tempIssues
                    if (_.difference(selectedLabels, issue_labels).length === 0)
                        tempIssues.push(issues[j]);
                }
                return tempIssues;
            } else {
                return issues; //Nothing is selected - return the original.
            }
        };
    }
]);



angular.module('checkboxesFilter', []).filter('checkboxesFilter', [function() {
        return function(issues, stateControls) {
            if (stateControls === undefined)
                return issues;
            else if (issues === undefined)
                return issues;
            if (stateControls.showIssuesWithComments === false && stateControls.showIssuesWithOutComments === false)
                return new Array();


            var withComments = _.filter(issues, function(issue) {
                if (stateControls.showIssuesWithComments === true) {
                    if (issue.comments !== 0)
                        return true;
                    else
                        return false;
                } else {
                    if (issue.comments === 0)
                        return true;
                    else
                        return false;
                }
            });
            var withoutComments = _.filter(issues, function(issue) {
                if (stateControls.showIssuesWithOutComments === true) {
                    if (issue.comments === 0)
                        return true;
                    else
                        return false;
                } else {
                    if (issue.comments !== 0)
                        return true;
                    else
                        return false;
                }
            });

            return  _.union(withComments, withoutComments);
        };
    }]);