


App.directive('commitsVisualization', function(pieChartService, commentsHandler) {
    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var width = viewportWidth / 2;
    var height = width;

    return {
        restrict: 'E',
        link: function(scope, element, attrs) {

            pieChartService.getJSON(scope.eKnight[0], function(data) {
                scope.piChartData = data;
            });

            var svg = d3.select(element[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", 'filesPiChart')
                    .attr("id", 'filesPiChart')
                    .append("g")
                    .attr("transform", "translate(" + viewportWidth / 1.5 + "," + viewportHeight * .52 + ")");

            scope.$watch('piChartData', function() {
                if (scope.piChartData === undefined)
                    return;


            });
        }
    };
});