
function init_code_hierarchy_plot(element_id, data) {
    "use strict";
    var width = document.getElementById(element_id).offsetWidth;
    var height = width;
    var data_slices = new Array();
    var max_level = 6;
    var color = d3.scale.category20c();

    var svg = d3.select("#" + element_id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

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
        window.console.log(level);
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

    process_data(data, 0, 0, 360. / 180.0 * Math.PI);


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
                return element_id + i;
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
                return d.name + "," + d.level;
            });

    var legend = d3.select("#" + element_id + "_legend");
    function update_legend(d) {
        var html = "<h2>" + d.name + "</h2><p>" + humanFileSize(d.total, true) + ", " + d.size + " Lines of code.</p>";
        legend.html(html);

        legend.transition().duration(200).style("opacity", "1");
    }

    function remove_legend(d) {
        legend.transition().duration(1000).style("opacity", "0");
    }


    function rebaseTween(new_ref) {
        return function(d) {
            var level = d3.interpolate(get_level(d, ref), get_level(d, new_ref));
            var start_deg = d3.interpolate(get_start_angle(d, ref), get_start_angle(d, new_ref));
            var stop_deg = d3.interpolate(get_stop_angle(d, ref), get_stop_angle(d, new_ref)); // var opacity = d3.interpolate(100, 0);
            return function(t) {
                return arc([start_deg(t), stop_deg(t), d.name, level(t)]);
            };
        };
    }

    var animating = false;

    function animate(d) {
        if (animating)
            return;

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
}

function init_plots() {
    init_code_hierarchy_plot("code_hierarchy", code_hierarchy_data);
}

window.onload = init_plots;