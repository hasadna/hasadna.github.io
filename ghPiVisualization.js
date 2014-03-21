/**
 * @param {type} d
 * @param {type} ref
 * @returns {number}
 */
function get_start_angle(d, ref) {
    if (ref) {
        var ref_span = ref.stop_deg - ref.start_deg;
        return (d.start_deg - ref.start_deg) / ref_span * Math.PI * 2.0;
    } else
        return d.start_deg;
}
/**
 * @param {type} d
 * @param {type} ref
 * @returns {number}
 */
function get_stop_angle(d, ref) {
    if (ref) {
        var ref_span = ref.stop_deg - ref.start_deg;
        return (d.stop_deg - ref.start_deg) / ref_span * Math.PI * 2.0;
    } else
        return d.start_deg;
}
/**
 * @param {type} d
 * @param {type} ref
 * @returns {number}
 */
function get_level(d, ref) {
    if (ref)
        return d.level - ref.level;
    else
        return d.level;
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (bytes < thresh)
        return bytes + ' B';
    if (si)
        var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    else
        var units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (bytes >= thresh);
    return bytes.toFixed(1) + ' ' + units[u];
}




App.service('pieChartService', function($rootScope, $http) {
    var cache = null;
    this.getJSON = function(cb) {

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

App.directive('ghVisualization', function(pieChartService, commentsHandler) {
    var id_const = 'pi_id_';
    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var width = viewportWidth / 2;
    var height = width;
    var data_slices = new Array();
    var max_level = 6;
    var color = d3.scale.category20c();

    return {
        restrict: 'E',
        scope: {
            visible: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('visible', function(vis) {
                if (vis === false || vis === undefined)
                    return;

                pieChartService.getJSON(function(data) {
                    scope.piChartData = data;
                });

                var svg = d3.select(element[0]).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("class", 'filesPiChart')
                        .attr("id", 'filesPiChart')
                        .append("g")
                        .attr("transform", "translate(" + viewportWidth / 3 + "," + viewportHeight * .52 + ")");

                scope.$watch('piChartData', function() {
                    if (scope.piChartData === undefined)
                        return;
                    
                    function process_data(data, level, start_deg, stop_deg) {
                        var name = data.name;
                        var total = data.size;
                        var size = data.size;
                        var children = data.children;
                        var current_deg = start_deg;
                        if (level > max_level)
                            return;

                        if (start_deg === stop_deg)
                            return;

                        data_slices.push({
                            "start_deg": start_deg, "stop_deg": stop_deg, "name": name,
                            "level": level, "total": total, "size": size, "log": data.log
                        });
                        for (var key in children) {
                            var child = children[key];
                            var inc_deg = (stop_deg - start_deg) / total * child.size;// child.size was child[count_index];
                            var child_start_deg = current_deg;
                            current_deg += inc_deg;
                            var child_stop_deg = current_deg;
                            var span_deg = child_stop_deg - child_start_deg;
                            process_data(child, level + 1, child_start_deg, child_stop_deg);
                        }
                    }

                    process_data(scope.piChartData, 0, 0, 360. / 180.0 * Math.PI);


                    var ref = data_slices[0];
                    var last_refs = new Array();

                    var thickness = width / 2.0 / (max_level + 2) * 1.1;

                    var arc = d3.svg.arc()
                            .startAngle(function(d) {
                                var level = (d.level !== undefined) ? d.level : d[3];
                                var start_deg = (d.start_deg !== undefined) ? d.start_deg : d[0];
                                if (level === 0)
                                    return start_deg;
                                return start_deg + 0.01;
                            })
                            .endAngle(function(d) {
                                var level = (d.level !== undefined) ? d.level : d[3];
                                var stop_deg = (d.stop_deg !== undefined) ? d.stop_deg : d[1];
                                if (level === 0)
                                    return stop_deg;

                                return stop_deg - 0.01;
                            })
                            .innerRadius(function(d) {
                                var level = (d.level !== undefined) ? d.level : d[3];
                                return 1.1 * level * thickness;
                            })
                            .outerRadius(function(d) {
                                var level = (d.level !== undefined) ? d.level : d[3];
                                return (1.1 * level + 1) * thickness;
                            });

                    var slices = svg.selectAll(".form")
                            .data(function(d) {
                                return data_slices;
                            })
                            .enter()
                            .append("g");

                    slices.append("path")
                            .attr("d", arc)
                            .attr("id", function(d, i) {
                                return id_const + i;
                            })
                            .style("fill", function(d) {
                                return color(d.name);
                            })
                            .on("click", animate)
                            .on("mouseover", update_legend)
                            .on("mouseout", remove_legend)
                            .attr("class", "form")
                            .append("svg:title").text(
                            function(d) {
                                return d.name;//+ "," + d.level;
                            });

                    var legX = 10 + -viewportWidth / 3;
                    var legend = svg.append("text")
                            .attr("x", legX)
                            .attr("y", -viewportHeight * .47)
                            .style("font-size", "34px")
                            .text("");

                    var legend_fileSize = svg.append("text")
                            .attr("x", legX)
                            .attr("y", -viewportHeight * .43)
                            .style("font-size", "20px")
                            .text("");

                    function update_legend(d) {
                        legend.text(d.name);
                        legend.transition().duration(200).style("opacity", "1");

                        legend_fileSize.text(humanFileSize(d.total, true));
                        legend_fileSize.transition().duration(200).style("opacity", "1");
                    }

                    function remove_legend(d) {
                        legend.transition().duration(1000).style("opacity", "0");
                        legend_fileSize.transition().duration(1000).style("opacity", "0");
                    }

                    function rebaseTween(new_ref) {
                        return function(d) {
                            var level = d3.interpolate(get_level(d, ref), get_level(d, new_ref));
                            var start_deg = d3.interpolate(get_start_angle(d, ref), get_start_angle(d, new_ref));
                            var stop_deg = d3.interpolate(get_stop_angle(d, ref), get_stop_angle(d, new_ref)); // var opacity = d3.interpolate(100, 0);
                            return function(t) {
                                return arc([
                                    start_deg(t), stop_deg(t), d.name, level(t)
                                ]);
                            };
                        };
                    }

                    var animating = false;

                    var logBox = document.createElement("div");
                    element[0].appendChild(logBox);
                    logBox.id = "log-box";
                    logBox.clean = function() {
                        while (this.firstChild) {
                            this.removeChild(this.firstChild);
                        }
                    };

                    function animate(d) {
                        if (animating)
                            return;
                        logBox.clean();

                        for (var i = 0; i < d.log.length; i++) {
                            var comm = document.createElement("p");
                            if (i % 2 !== 0)
                                comm.classList.add('pi-odd');
                            comm.innerHTML =
                                    "<span class=\"pi-author\">" + d.log[i].author + "</span> commited " +
                                    "<span title=\"" + d.log[i].date + "\">" +
                                    commentsHandler.timeSince(d.log[i].date) + "</span> ago.<br>" +
                                    "<span class=\"pi-comm-title\">Commit</span>:<br><span class=\"pi-commit\">" + d.log[i].commit + "</span><br>" +
                                    "<span class=\"pi-comm-title\">Message</span>:<br><span class=\"pi-message\">" + d.log[i].body + "</span>";
                            logBox.appendChild(comm);
                        }

                        animating = true;
                        var revert = false;
                        var new_ref;
                        var last_ref;
                        if (d === ref && last_refs.length > 0) {
                            revert = true;
                            last_ref = last_refs.pop();
                        }
                        if (revert) {
                            d = last_ref;
                            new_ref = ref;
                            svg.selectAll(".form").filter(function(b) {
                                if (b.start_deg >= last_ref.start_deg && b.stop_deg <= last_ref.stop_deg && b.level >= last_ref.level) {
                                    return true;
                                }
                                return false;
                            })
                                    .transition().duration(1000).style("opacity", "1").attr("pointer-events", "all");
                        } else {
                            new_ref = d;
                            svg.selectAll(".form").filter(function(b) {
                                if (b.start_deg < d.start_deg || b.stop_deg > d.stop_deg || b.level < d.level) {
                                    return true;
                                }
                                return false;
                            }
                            ).transition().duration(1000).style("opacity", "0").attr("pointer-events", "none");
                        }
                        svg.selectAll(".form").filter(function(b) {
                            if (b.start_deg >= new_ref.start_deg && b.stop_deg <= new_ref.stop_deg && b.level >= new_ref.level) {
                                return true;
                            }
                            return false;
                        }
                        ).transition().duration(1000).attrTween("d", rebaseTween(d));
                        setTimeout(function() {
                            animating = false;
                            if (!revert) {
                                last_refs.push(ref);
                                ref = d;
                            } else {
                                ref = d;
                            }
                        }, 1000);
                    }
                });
            });

            pieChartService.visibilityFunction = function(isVisible) {
                scope.visible = isVisible;
            };
        }
    };
});