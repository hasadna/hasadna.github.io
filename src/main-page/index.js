/**
 * @description Filter that takes items with empty name from ordered array and places them at the end
 * @param {Array} array
 * @param {string} key
 */
App.filter("emptyToEnd", function() {
    return function(array, key) {
        if (! angular.isArray(array))
            return;
        var present = array.filter(function(item) {
            return item[key];
        });
        var empty = array.filter(function(item) {
            return ! item[key];
        });
        return present.concat(empty);
    };
});
/***
 *@description Format a JavaScript Date as a string stating the time elapsed
 *@see http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
 */
App.filter('hebTimeAgo', function() {
    /**
     * @param {Dtae|null|undefined} time 
     * @return {string} 
     */
    return function(time) {
        if (typeof time === 'undefined')
            return 'לא ידוע';
        time = + new Date(time);
        var time_formats = [
            [60, 'שניות', 1], // 60
            [120, 'לפני דקה', 'בעד דקה מעכשיו'], // 60*2
            [3600, 'דקות', 60], // 60*60, 60
            [7200, 'לפני שעה', 'בעוד שעה מעכשיו'], // 60*60*2
            [86400, 'שעות', 3600], // 60*60*24, 60*60
            [172800, 'אתמול', 'מחר'], // 60*60*24*2
            [604800, 'ימים', 86400], // 60*60*24*7, 60*60*24
            [1209600, 'לפני שבוע', 'בשבוע הבא'], // 60*60*24*7*4*2
            [2419200, 'שבועות', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, 'לפני חודש', 'בחודש הבא'], // 60*60*24*7*4*2
            [29030400, 'חודשים', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'לפני שנה', 'בשנה הבאה'], // 60*60*24*7*4*12*2
            [2903040000, 'שנים', 29030400] // 60*60*24*7*4*12*100, 60*60*24*7*4*12
                    //[5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
                    //[58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+ new Date() - time) / 1000;
        var token = 'לפני';
        var list_choice = 1;
        if (seconds == 0)
            return 'עכשיו';
        if (seconds < 0){
            seconds = Math.abs(seconds);
            token = 'מעכשיו';
            list_choice = 2;
        }
        var i = 0,
                format;
        while (format = time_formats[i++])
            if (seconds < format[0]){
                if (typeof format[2] === 'string')
                    return format[list_choice];
                else
                    return token + ' ' + Math.floor(seconds / format[2]) + ' ' + format[1];
            }
        return time;
    };
});
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