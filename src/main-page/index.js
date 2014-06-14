
/**
 * @description Controller for the main page.
 * @param {Object} $scope  See <a href="https://docs.angularjs.org/guide/scope">What are Scopes?</a>
 * @param {Object} $window A reference to the browser's window object. See <a href="https://docs.angularjs.org/api/ng/service/$window">$window</a>
 * @param {Object} $http service. See: <a href="https://docs.angularjs.org/api/ng/service/$http">$http</a>
 * @param {Object} timeUtill 
 */
function indexCtrl($scope, $window, $http, timeUtill) {
    $scope.relativizePath = $window.CONFIG.relativizePath;

    var unknownLastUpdate = [];
    /**
     * @description Add lastUpdate property to all the eKnights.
     * @param {Object} updatedData 
     * @param {number} status HTTP status code of the response.
     * @param {function([headerName])} headers Header getter function
     * @param {Object} config The configuration object that was used to generate the request.
     */
    function addLastUpdateProperty(updatedData, status, headers, config) {
        $scope.eKnights = $window.eKnightsData;
        $scope.eKnights.forEach(function(eKnight) {
            // Get main repository 
            for (var i = 0; i < eKnight.repositories.length; i++) {
                if (eKnight.repositories[i].main === true) {
                    eKnight.mainRepo = new Repository(eKnight.repositories[i]);
                    break;
                }
            }
            var url = eKnight.github_repo.toLowerCase();
            for (var i = 0; i < updatedData.length; i++) {
                if (updatedData[i].html_url.toLowerCase() === url) {
                    eKnight.lastUpdate = updatedData[i].pushed_at;
                    //break;
                }
            }
            if (!eKnight.lastUpdate)
                unknownLastUpdate.push(eKnight);
        }); //End eKnights.forEach

        if (unknownLastUpdate.length !== 0) {
            var index = unknownLastUpdate.length - 1;

            /**
             * @description Set the lastUpdate property by github API URL of the mainRepo.
             * @param {number} i index of unknownLastUpdate array to work on
             */
            function updateByRepoUrl(i) {
                if (i === -1)
                    return;
                var request = $http({
                    method: 'GET',
                    url: unknownLastUpdate[i].mainRepo.getGithubApiUrl()
                });
                request.success(function(data, status, headers, config) {
                    unknownLastUpdate[i].lastUpdate = data.pushed_at;
                });

                updateByRepoUrl(--index);
            }
            updateByRepoUrl(index);

            $scope.oldReposExists = false;
            var today = new Date();
            var threeMonthsInDays = 90; // = 3*30
            $scope.eKnights.forEach(function(eKnight) {
//                console.log(new Date(eKnight.lastUpdate));
                var diff = timeUtill.dayDiff(new Date(eKnight.lastUpdate), today);
                if (diff > threeMonthsInDays)
                    $scope.oldReposExists = true;
            });
        }
        $scope.small_repos = $window.small_repos;
    }

    var request = $http({
        method: 'GET',
        url: 'https://api.github.com/orgs/hasadna/repos?type=all'
    });

    // When the request success - call addLastUpdateProperty function
    request.success(addLastUpdateProperty);
}

// Create the controller
App.controller('indexCtrl', indexCtrl);