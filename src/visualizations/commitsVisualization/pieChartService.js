
App.service('commitsChartService', function($rootScope, $http) {
    var cache = null;

    this.getJSON = function(eKnight, cb) {
        if (cache !== null) {
            cb(cache);
            return;
        }
        
        var req = $http.get('data/' + eKnight.slug + '.json');
        req.success(function(data, status, headers, config) {
            cache = data;
            cb(data);
        });

        req.error(function(data, status, headers, config) {
            alert(status + " | bad");
        });
    };

});
