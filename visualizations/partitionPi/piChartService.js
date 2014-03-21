

/**
 * @description Service to load data for pi chart
 * @param {$http} $http
 */
App.service('piChartService', function($http) {
    var cache = null;
    this.getJSON = function(cb) {
        if (cache !== null) {
            cb(cache);
            return;
        }

        var req = $http.get('data/data.json');
        req.success(function(data, status, headers, config) {
            cache = data;
            cb(data);
        });

        req.error(function(data, status, headers, config) {
            alert(status + " | bad");
        });
    };
    this.visibilityFunction = null;
    this.visible = false;

    this.toggleVisibility = function() {
        this.visible = !this.visible;
        this.visibilityFunction(this.visible);
    };


});