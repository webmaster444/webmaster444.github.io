/**
 * @author Webmaster444
 * @version 2.0
 */
d3.gantt = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";

    var margin = {
        top: 20,
        right: 40,
        bottom: 20,
        left: 150
    };

    var margin2 = {
        top: 430,
        right: 10,
        bottom: 20,
        left: 40
    }
    var timeDomainStart = d3.time.day.offset(new Date(), -3);
    var timeDomainEnd = d3.time.hour.offset(new Date(), +3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE; // fixed or fit
    var taskTypes = [];
    var taskStatus = [];
    var height = document.body.clientHeight - margin.top - margin.bottom - 5;
    var focus_height = height - 150;
    var height2 = 120;
    var width = document.body.clientWidth - margin.right - margin.left - 5;

    var tickFormat = "%H:%M";

    var keyFunction = function(d) {
        return d.startDate + d.machineId + d.endDate;
    };

    var rectTransform = function(d) {
        return "translate(" + x(d.startDate) + "," + y(d.machineId) + ")";
    };

    var initTimeDomain = function(tasks) {
        if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
            if (tasks === undefined || tasks.length < 1) {
                timeDomainStart = d3.time.day.offset(new Date(), -3);
                timeDomainEnd = d3.time.hour.offset(new Date(), +3);
                return;
            }
            tasks.sort(function(a, b) {
                return a.endDate - b.endDate;
            });
            timeDomainEnd = tasks[tasks.length - 1].endDate;
            tasks.sort(function(a, b) {
                return a.startDate - b.startDate;
            });
            timeDomainStart = tasks[0].startDate;
        }
    };

    var initAxis = function() {
        x = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);
        y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([0, focus_height - margin.top - margin.bottom], .1);

        // var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        x2 = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);
        y2 = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([0, 120], .1);

        xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
            .tickSize(-focus_height + 45).tickPadding(8).outerTickSize(8);
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom");

        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(-width);
        yAxis2 = d3.svg.axis().scale(y2).orient("left").tickSize(0).tickValues('');
    };



    function gantt(tasks) {

        initTimeDomain(tasks);
        initAxis();

        var brush = d3.svg.brush()
            .x(x2)
            .on("brush", brushed);

        var svg = d3.select("body")
            .append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", focus_height);

        var focus = svg.append("g")
            .attr("class", "gantt-chart focus")
            .attr("width", width + margin.left + margin.right)
            .attr("height", focus_height + margin.top + margin.bottom - 150)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin.left + "," + parseInt(focus_height + 30) + ")");

        var zoom = d3.behavior.zoom()
            .on("zoom", draw);

        var rect = svg.append("svg:rect")
            .attr("class", "pane")
            .attr("width", width)
            .attr("height", focus_height + margin.top + margin.bottom - 80)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

        focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (focus_height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis);

        focus.append("g").attr("class", "y axis").transition().call(yAxis);

        // context.append("path")
        //        // .datum(data)
        //        .attr("class", "area")
        //        .attr("d", area2);
        // x.domain(d3.extent(tasks.map(function(d) { return d.startDate; })));
        // y.domain([0, d3.max(tasks.map(function(d) { return d.duration; }))]);
        // x2.domain(x.domain());
        // y2.domain(y.domain());

        zoom.x(x);

        context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        context.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0," + 0 + ")")
            .call(yAxis2);

        var g_containers_context = context.selectAll(".chart")
            .data(tasks, keyFunction).enter()
            .append('g')
            .attr("transform", function(d) {
                return "translate(" + x(d.startDate) + "," + y2(d.machineId) + ")";
            });

        g_containers_context.append("rect")
            .attr("class", function(d) {
                if (taskStatus[d.caster] == null) {
                    return "bar";
                }
                return taskStatus[d.caster];
            })
            .attr("y", 0)
            .attr('stroke', 'black')
            .attr('stroke-opacity', .3)
            .attr("stroke-dasharray", function(d) {
                var tmp_width = x(d.endDate) - x(d.startDate);
                return '0, ' + tmp_width + ',' + y2.rangeBand() + ', ' + tmp_width + ',' + y2.rangeBand();
            })
            .attr("height", function(d) {
                return y2.rangeBand();
            })
            .attr("width", function(d) {
                // return (d[4]);
                return (x(d.endDate) - x(d.startDate));
            });

        focus.selectAll("g.y .tick text").attr("x", 0).attr("dy", -4);
        focus.selectAll(".domain").remove();
        focus.selectAll("g.x .tick line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
        var g_containers = focus.selectAll(".chart")
            .data(tasks, keyFunction).enter()
            .append('g')
            .attr('class', 'box')
            .attr("transform", rectTransform);

        g_containers.append("rect")
            .attr("class", function(d) {
                if (taskStatus[d.caster] == null) {
                    return "bar";
                }
                return taskStatus[d.caster];
            })
            .attr("y", 0)
            .attr('stroke', 'black')
            .attr('stroke-opacity', .3)
            .attr("stroke-dasharray", function(d) {
                var tmp_width = x(d.endDate) - x(d.startDate);
                return '0, ' + tmp_width + ',' + y.rangeBand() + ', ' + tmp_width + ',' + y.rangeBand();
            })
            .attr("height", function(d) {
                return y.rangeBand();
            })
            .attr("width", function(d) {
                // return (d[4]);
                return (x(d.endDate) - x(d.startDate));
            });
        g_containers.append("text")
            .attr('class', 'txt_grade')
            .attr('font-size', '10px')
            .attr("x", function(d) {
                return 5;
            })
            .attr("y", 8)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.grade;
            });

        g_containers.selectAll('.txt_grade').text(function(d) {
            var current_length = this.getComputedTextLength();
            var g_c = d3.select(this.parentNode);
            var rect_length = g_c.select('rect').attr('width');
            if (rect_length - 5 > current_length) {
                return d.grade;
            }
            var temp_st = d.grade;
            var res = temp_st.substring(0, 5);
            return res + '...';
        });

        g_containers.append("text")
            .attr('class', 'txt_id')
            .attr('font-size', '10px')
            .attr('font-weight', '700')
            .attr("x", function(d) {
                return (x(d.endDate) - x(d.startDate)) / 2 - 5
            })
            .attr("y", function(d) {
                return y.rangeBand() / 2;
            })
            .attr("dy", ".35em")
            .text(function(d) {
                return d.boxIndex;
            });

        g_containers.append("text")
            .attr('class', 'txt_duration')
            .attr('font-size', '10px')
            .attr("x", function(d) {
                return (x(d.endDate) - x(d.startDate)) - 15;
            })
            .attr("y", function(d) {
                return y.rangeBand() - 5;
            })
            .attr("dy", ".35em")
            .text(function(d) {
                return d.duration;
            });
        context.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", height2 + 7);

        // add y axis
        focus.append('line').attr('class', 'y_axis').style("stroke", "black") // colour the line
            .attr("x1", 0) // x position of the first end of the line
            .attr("y1", 8) // y position of the first end of the line
            .attr("x2", 0) // x position of the second end of the line
            .attr("y2", focus_height - margin.top - margin.bottom);

        function brushed() {
            x.domain(brush.empty() ? x2.domain() : brush.extent());

            gantt.redraw(tasks);
            focus.select(".x.axis").call(xAxis);
            // Reset zoom scale's domain
            zoom.x(x);
        }

        function draw() {
            focus.select(".x.axis").call(xAxis);
            // Force changing brush range
            brush.extent(x.domain());
            svg.select(".brush").call(brush);
            gantt.redraw(tasks);
        }

        function type(d) {
            d.date = parseDate(d.date);
            d.price = +d.price;
            return d;
        }

        return gantt;

    };

    gantt.redraw = function(tasks) {
        var svg = d3.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");

        svg.selectAll(".txt_grade").remove();
        svg.selectAll(".txt_id").remove();
        svg.selectAll(".txt_duration").remove();

        var g_wrappers = ganttChartGroup.selectAll('.box').data(tasks, keyFunction).attr("transform", rectTransform);

        var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);

        rect.enter()
            .insert("rect", ":first-child")
            .attr("class", function(d) {
                if (taskStatus[d.status] == null) {
                    return "bar";
                }
                return taskStatus[d.status];
            })
            // .transition()
            .attr("y", 0)
            // .attr("transform", rectTransform)
            .attr("height", function(d) {
                return y.rangeBand();
            })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });


        rect
            // .transition()
            // .attr("transform", rectTransform)
            .attr('stroke', 'black')
            .attr('stroke-opacity', .3)
            .attr("stroke-dasharray", function(d) {
                var tmp_width = x(d.endDate) - x(d.startDate);
                return '0, ' + tmp_width + ',' + y.rangeBand() + ', ' + tmp_width + ',' + y.rangeBand();
            })
            .attr("height", function(d) {
                return y.rangeBand();
            })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });

        rect.exit().remove();

        g_wrappers.append("text")
            .attr('class', 'txt_grade')
            .attr('font-size', '10px')
            .attr("x", function(d) {
                return 5;
            })
            .attr("y", 8)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.grade;
            });

        g_wrappers.selectAll('.txt_grade').text(function(d) {
            var current_length = this.getComputedTextLength();
            var g_c = d3.select(this.parentNode);
            var rect_length = g_c.select('rect').attr('width');

            if (rect_length < 70)
                return '';
            if (rect_length - 5 > current_length) {
                return d.grade;
            }
            var temp_st = d.grade;
            var res = temp_st.substring(0, 5);
            return res + '...';


        });

        g_wrappers.append("text")
            .attr('class', 'txt_id')
            .attr('font-size', '10px')
            .attr('font-weight', '700')
            .attr("x", function(d) {
                return (x(d.endDate) - x(d.startDate)) / 2 - 5
            })
            .attr("y", function(d) {
                return y.rangeBand() / 2;
            })
            .attr("dy", ".35em")
            .text(function(d) {
                var current_length = this.getComputedTextLength();
                var g_c = d3.select(this.parentNode);
                var rect_length = g_c.select('rect').attr('width');

                if (rect_length < 70)
                    return '';
                return d.boxIndex;
            });


        g_wrappers.append("text")
            .attr('class', 'txt_duration')
            .attr('font-size', '10px')
            .attr("x", function(d) {
                return (x(d.endDate) - x(d.startDate)) - 15;
            })
            .attr("y", function(d) {
                return y.rangeBand() - 5;
            })
            .attr("dy", ".35em")
            .text(function(d) {
                var current_length = this.getComputedTextLength();
                var g_c = d3.select(this.parentNode);
                var rect_length = g_c.select('rect').attr('width');

                if (rect_length < 70)
                    return '';
                return d.duration;
            });

        return gantt;
    };

    gantt.margin = function(value) {
        if (!arguments.length)
            return margin;
        margin = value;
        return gantt;
    };

    gantt.timeDomain = function(value) {
        if (!arguments.length)
            return [timeDomainStart, timeDomainEnd];
        timeDomainStart = +value[0], timeDomainEnd = +value[1];
        return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
        if (!arguments.length)
            return timeDomainMode;
        timeDomainMode = value;
        return gantt;

    };

    gantt.taskTypes = function(value) {
        if (!arguments.length)
            return taskTypes;
        taskTypes = value;
        return gantt;
    };

    gantt.taskStatus = function(value) {
        if (!arguments.length)
            return taskStatus;
        taskStatus = value;
        return gantt;
    };

    gantt.width = function(value) {
        if (!arguments.length)
            return width;
        width = +value;
        return gantt;
    };

    gantt.height = function(value) {
        if (!arguments.length)
            return height;
        height = +value;
        return gantt;
    };

    gantt.tickFormat = function(value) {
        if (!arguments.length)
            return tickFormat;
        tickFormat = value;
        return gantt;
    };

    //brush functions



    return gantt;
};