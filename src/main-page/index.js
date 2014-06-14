
/***
 * 
 * @param {type} param1
 * @param {type} param2
 */
App.controller('indexCtrl', function($scope, $window, $http) {
    $scope.relativizePath = $window.CONFIG.relativizePath;

    var request = $http({
        method: 'GET',
        url: 'https://api.github.com/orgs/hasadna/repos?type=all'
    });
    request.success(function(updatedData, status, headers, config) {
        $scope.eKnights = $window.eKnightsData;
        //        window.console.log(updatedData.length);
        //        var aaa = [];
        //        for (var i = 0; i < updatedData.length; i++) {
        //            aaa.push(updatedData[i].html_url);
        //        }
        //
        //        aaa.sort(function(a, b) {
        //            if (a.toLowerCase().substring(27) < b.toLowerCase().substring(27))
        //                return -1;
        //            if (a.toLowerCase().substring(27) > b.toLowerCase().substring(27))
        //                return 1;
        //
        //            return 0;
        //        });
        //
        //        for (var i = 0; i < aaa.length; i++) {
        ////            window.console.log(aaa[i]);
        //        }
        $scope.eKnights.forEach(function(eKnight) {
            var mainRepo;
            // get main repository 
            for (var i = 0; i < eKnight.repositories.length; i ++) {
                if (eKnight.repositories[i].main === true){
                    mainRepo = new Repository(eKnight.repositories[i]);
                    break;
                }
            }
            var url = eKnight.github_repo.toLowerCase();
            for (var i = 0; i < updatedData.length; i ++) {
                if (updatedData[i].html_url.toLowerCase() === url){
                    eKnight.lastUpdate = updatedData[i].pushed_at;
                    //break;
                }
            }
            if (! eKnight.lastUpdate){
                //                eKnight.lastUpdate;
                //                window.console.log(eKnight.github_repo);
                //                debugger;
            }
            //html_url
            //pushed_at
        });
        $scope.small_repos = $window.small_repos;
    });
    request.error(function(data, status, headers, config) {
    });
});