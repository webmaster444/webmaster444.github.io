if (!Array.prototype.remove) {
    Array.prototype.remove = function(val) {
        var i = this.indexOf(val);
        return i > -1 ? this.splice(i, 1) : [];
    };
}

d3.csv("assets/data/richest_people.csv").then(function(data) {
    draw(data)
});


function draw(data) {
    var date = [];
    var names = [];
    data.forEach(element => {
        if (date.indexOf(element["date"]) == -1) {
            date.push(element["date"]);
        }
        if (names.indexOf(element['name']) == -1) {
            names.push(element['name']);
        }
    });
    let rate = [];
    var auto_sort = config.auto_sort;
    if (auto_sort) {
        var time = date.sort((x, y) => new Date(x) - new Date(y));
    } else {
        var time = date;
    }

    var colorByNames = new Object;

    var colorsArray = ["#FF0000","#000000","#6B7490","#666665", "#3D0048", "#001348", "#004839", "#1F5200", "#5A5700", "#5A0000", "#9C0082", "#47009C", "#00289C", "#006F9C", "#009C6A", "#6A9C00", "#9C5A00","#9C0000","#FF00F0","#8700FF","#001BFF","#00BDFF","#04FF00", "#FFA200"];
    names.forEach(function(name) {
        var tmp1 = new Object;
        name = name.replace(/\s/g, '');
        colorByNames[name] = colorsArray[Math.floor(Math.random()*colorsArray.length)];;
    })
    
    var big_value = config.big_value;
    var divide_by = config.divide_by;
    var divide_color_by = config.divide_color_by;
    var name_list = [];
    
    var baseTime = 3000;

    var showMessage = config.showMessage;
    var allow_up = config.allow_up;
    var interval_time = config.interval_time;
    var text_y = config.text_y;
    var itemLabel = config.itemLabel;
    var typeLabel = config.typeLabel;
    // 长度小于display_barInfo的bar将不显示barInfo
    var display_barInfo = config.display_barInfo;
    // 显示类型
    if (config.use_type_info) {
        var use_type_info = config.use_type_info;
    } else if (divide_by != "name") {
        var use_type_info = true;
    } else {
        var use_type_info = false;
    }
    // 使用计数器
    var use_counter = config.use_counter;
    // 每个数据的间隔日期
    var step = config.step;
    
    var format = config.format;
    var left_margin = config.left_margin;
    var right_margin = config.right_margin;
    var top_margin = config.top_margin;
    var bottom_margin = config.bottom_margin;
    var timeFormat = config.timeFormat;
    var item_x = config.item_x;
    var max_number = config.max_number;
    var reverse = config.reverse;
    var text_x = config.text_x;
    var offset = config.offset;
    var animation = config.animation;
    const margin = {
        left: left_margin,
        right: right_margin,
        top: top_margin,
        bottom: bottom_margin
    };
    var background_color = config.background_color;

    d3.select("body").attr("style", "background:" + background_color);

    var enter_from_0 = config.enter_from_0;
    interval_time /= 3;
    var lastData = [];
    var currentdate = time[0].toString();
    var currentData = [];
    var lastname;

    const width = document.getElementById("chart_wrapper").getBoundingClientRect().width;
    const height = document.getElementById("chart_wrapper").getBoundingClientRect().height;

    const svg = d3.select("svg")
        .attr('width', width)
        .attr('height', height)
        .style('background', function(d, i) {
            if (config.blur_background_image)
                return 'linear-gradient(rgba(253, 242, 232, 0.8), rgba(253, 242, 232, 0.8)), url("assets/img/background.png")';
            else
                return 'url("assets/img/background.png") no-repeat';
        })
        .style('background-size', '100%')        
        .style('-webkit-animation', function(d) {
            if (config.animate_background_image) return 'slide 120s linear infinite';
            return null;

        });

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom - 32;
    //var dateLabel_y = height - margin.top - margin.bottom - 32;;
    const xValue = d => Number(d.value);
    const yValue = d => d.name;

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    const xAxisG = g
        .append("g")
        .attr("transform", `translate(0, 0)`);
    const yAxisG = g.append("g");

    xAxisG
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", 100);

    var xScale = d3.scaleLinear();
    
    const yScale = d3
        .scaleBand()
        .paddingInner(0.3)
        .paddingOuter(0);

    const xTicks = 7;
    const xAxis = d3
        .axisTop()
        .scale(xScale)
        .ticks(xTicks)
        .tickPadding(10)
        .tickFormat(d => {
            if (d <= 0) {
                return "";
            }
            return d;
        })
        .tickSize(-innerHeight);


    const yAxis = d3
        .axisLeft()
        .scale(yScale)
        .tickPadding(5)
        .tickSize(-innerWidth);

    var dateLabel_switch = config.dateLabel_switch;
    var dateLabel_x = config.dateLabel_x;
    var dateLabel_y = config.dateLabel_y;
    //dateLabel位置
    if (dateLabel_x == null || dateLabel_y == null) {
        dateLabel_x = innerWidth; //默认
        dateLabel_y = innerHeight; //默认
    } //是否隐藏
    if (dateLabel_switch == false) {
        dateLabel_switch = "hidden";
    } else {
        dateLabel_switch = "visible";
    }

    var dateLabel = g
        .insert("text")
        .data(currentdate)
        .attr("class", "dateLabel")
        .attr('font-size', config.date_label.font_size + 'pt')
        .attr("style:visibility", dateLabel_switch)
        .attr("x", dateLabel_x + config.date_label.x)
        .attr("y", dateLabel_y + config.date_label.y)
        .attr("text-anchor", function() {
            return "end";
        })
        .text(currentdate);

    var topLabel = g
        .insert("text")
        .attr("class", "topLabel")
        .attr("font-size", config.champion_name.font_size + 'pt')
        .attr("x", config.champion_name.x)
        .attr("y", config.growth_text.text_y);

    function dataSort() {
        if (reverse) {
            currentData.sort(function(a, b) {
                if (Number(a.value) == Number(b.value)) {
                    var r1 = 0;
                    var r2 = 0;
                    for (let index = 0; index < a.name.length; index++) {
                        r1 = r1 + a.name.charCodeAt(index);
                    }
                    for (let index = 0; index < b.name.length; index++) {
                        r2 = r2 + b.name.charCodeAt(index);
                    }
                    return r2 - r1;
                } else {
                    return Number(a.value) - Number(b.value);
                }
            });
        } else {
            currentData.sort(function(a, b) {
                if (Number(a.value) == Number(b.value)) {
                    var r1 = 0;
                    var r2 = 0;
                    for (let index = 0; index < a.name.length; index++) {
                        r1 = r1 + a.name.charCodeAt(index);
                    }
                    for (let index = 0; index < b.name.length; index++) {
                        r2 = r2 + b.name.charCodeAt(index);
                    }
                    return r2 - r1;
                } else {
                    return Number(b.value) - Number(a.value);
                }
            });
        }
    }

    function getCurrentData(date) {
        rate = [];
        currentData = [];
        indexList = [];

        data.forEach(element => {
            if (element["date"] == date && parseFloat(element["value"]) != 0) {
                if (element.name.length > config.bar_name_max) {
                    tail = "...";
                } else {
                    tail = "";
                }
                element.name = element.name.slice(0, config.bar_name_max - 1) + tail;
                element.value = parseFloat(element.value);
                currentData.push(element);
            }
        });

        rate["MAX_RATE"] = 0;
        rate["MIN_RATE"] = 1;
        currentData.forEach(e => {
            _cName = e.name;
            lastData.forEach(el => {
                if (el.name == e.name) {
                    rate[e.name] = Number(Number(e.value) - Number(el.value));
                }
            });
            if (rate[e.name] == undefined) {
                rate[e.name] = rate["MIN_RATE"];
            }
            if (rate[e.name] > rate["MAX_RATE"]) {
                rate["MAX_RATE"] = rate[e.name];
            } else if (rate[e.name] < rate["MIN_RATE"]) {
                rate["MIN_RATE"] = rate[e.name];
            }
        });
        currentData = currentData.slice(0, max_number);

        dataSort();

        d3.transition("2")
            .each(redraw)
            .each(change);
        lastData = currentData;
    }

    var lastname;
    var counter = {
        value: 1
    };

    var avg = 0;
    var enter_from_now = true;
    var firstTime = true;

    function redraw() {
        if (currentData.length == 0) return;

        if (big_value) {
            xScale
                .domain([
                    2 * d3.min(currentData, xValue) - d3.max(currentData, xValue),
                    d3.max(currentData, xValue) + 10
                ])
                .range([0, innerWidth]);
        } else {
            xScale
                .domain([0, d3.max(currentData, xValue) + 1])
                .range([0, innerWidth]);
        }
        if (auto_sort) {
            dateLabel
                .data(currentData)
                .transition()
                .duration(baseTime * interval_time)
                .ease(d3.easeLinear)
                .tween("text", function(d) {
                    var self = this;
                    var i = d3.interpolateDate(
                        new Date(self.textContent),
                        new Date(d.date)
                    );
                    return function(t) {
                        var dateformat = d3.timeFormat(timeFormat);
                        self.textContent = dateformat(i(t));
                    };
                });
        } else {
            dateLabel.text(currentdate);
        }


        xAxisG
            .transition()
            .duration(baseTime * interval_time)
            .ease(d3.easeLinear)
            .call(xAxis);
        yAxisG
            .transition()
            .duration(baseTime * interval_time)
            .ease(d3.easeLinear)
            .call(yAxis);

        yAxisG.selectAll(".tick").remove();
        if (!config.show_x_tick) {
            xAxisG.selectAll(".tick").remove();
        }

        yScale
            .domain(currentData.map(d => d.name).reverse())
            .range([innerHeight, 0]);

        var bar = g.selectAll(".bar").data(currentData, function(d) {
            return d.name;
        });

        if (showMessage) {
            // 榜首文字
            topLabel.data(currentData).text(function(d) {
                if (lastname == d.name) {
                    counter.value = counter.value + step;
                } else {
                    counter.value = 1;
                }
                lastname = d.name;
                if (d.name.length > 24) return d.name.slice(0, 23) + "...";
                return d.name;
            });

            if (use_counter == true) {
                // 榜首持续时间更新
                days
                    .data(currentData)
                    .transition()
                    .duration(baseTime * interval_time)
                    .ease(d3.easeLinear)
                    .tween("text", function(d) {
                        var self = this;
                        var i = d3.interpolate(self.textContent, counter.value),
                            prec = (counter.value + "").split("."),
                            round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;

                        return function(t) {
                            self.textContent = d3.format(format)(
                                Math.round(i(t) * round) / round
                            );
                        };
                    });
            } else if (use_type_info == true) {
                // 榜首type更新
                top_type.data(currentData).text(function(d) {
                    return d["type"];
                });
            }
        }

        var barEnter = bar
            .enter()
            .insert("g", ".axis")
            .attr("class", "bar")
            .attr("transform", function(d) {
                return "translate(0," + yScale(yValue(d)) + ")";
            });

        let bars = barEnter
            .append("rect")
            .attr("width", function(d) {
                if (enter_from_0) {
                    return 0;
                } else {
                    return xScale(currentData[currentData.length - 1].value);
                }
            })
            .attr("fill-opacity", 0)
            .attr("height", config.bar_height)
            .attr("y", 50)
            .style("fill", function(d) {
                name = d.name.replace(/\s/g, '');
                return colorByNames[name]
            })
            .transition("a")
            .delay(500 * interval_time)
            .duration(2490 * interval_time)
            .attr("y", 0)
            .attr("width", d => xScale(xValue(d)))
            .attr("fill-opacity", 1);
        
        if (config.display_left_of_the_bar == 'rank' && firstTime == true) {
            let ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

            g.selectAll('.ranks')
                .data(ranks)
                .enter()
                .append("text")
                .classed('ranks', true)
                .attr("y", (d, i) => 21 + (i * 55))
                .attr("id", (d, i) => "rank" + i)
                .attr("fill-opacity", 0)
                .style("fill", config.rank_label.color)
                .attr("fill-opacity", 1)
                .attr("class", function(d) {
                    return "label";
                })
                .attr("x", config.labelx)
                .attr("text-anchor", "end")
                .text(function(d, i) {
                    return d;
                });
        }

        if (config.showLabel == true && config.display_left_of_the_bar != 'rank') {
            barEnter
                .append("text")
                .attr("y", 50)
                .attr("fill-opacity", 0)
                .style("fill", function(d) {
                    name = d.name.replace(/\s/g, '');
                    return colorByNames[name];
                })
                .transition("2")
                .delay(500 * interval_time)
                .duration(2490 * interval_time)
                .attr("fill-opacity", 1)
                .attr("y", 0)
                .attr("class", function(d) {
                    return "label ";
                })
                .attr("x", config.labelx)
                .attr("y", 30)
                .attr("text-anchor", "end")
                .text(function(d, i) {
                    return d[config.display_left_of_the_bar];                                        
                });
        }

        // text inside bar
        var barInfo = barEnter
            .append("text")
            .attr("x", function(d) {                
                if (enter_from_0) {
                    return 0;
                } else {
                    return xScale(currentData[currentData.length - 1].value);
                }
            })
            .attr("stroke", function(d) {
                name = d.name.replace(/\s/g, '');
                return colorByNames[name]
            })
            .attr("class", function() {
                return "barInfo";
            })
            .attr("y", 10)
            .attr('font-size', config.player_name_size + 'pt')
            .attr("stroke-width", "0px")
            .attr("fill-opacity", 0)
            .transition()
            .delay(500 * interval_time)
            .duration(2490 * interval_time)
            .text(function(d) {
                return d[config.display_inside_the_bar];
            })
            .attr("x", d => {                
                return xScale(xValue(d)) - 10;
            })
            .attr("fill-opacity", function(d) {
                if (xScale(xValue(d)) - 10 < display_barInfo) {
                    return 0;
                }
                return 1;
            })
            .attr("y", 1.)
            .attr("dy", "0.97em")
            .attr("text-anchor", function() {                
                return "end";
            })
            .attr("stroke-width", function(d) {
                if (xScale(xValue(d)) - 10 < display_barInfo) {
                    return "0px";
                }
                return "0px";
            });
        
            barEnter
                .append("text")
                .attr("x", function() {
                    if (enter_from_0) {
                        return 0;
                    } else {
                        return xScale(currentData[currentData.length - 1].value);
                    }
                })
                .attr("y", 50)
                .attr("fill-opacity", 0)
                .style("fill", function(d) {
                    name = d.name.replace(/\s/g, '');
                    return colorByNames[name]
                })
                .transition()
                .duration(2990 * interval_time)
                .tween("text", function(d) {
                    var self = this;
                    
                    self.textContent = d.value * 0.9;
                    var i = d3.interpolate(self.textContent, Number(d.value)),
                        prec = (Number(d.value) + "").split("."),
                        round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
                    
                    return function(t) {
                        self.textContent = d3.format(format)(
                            Math.round(i(t) * round) / round
                        ) + config.postfix;                        
                    };
                })
                .attr("fill-opacity", 1)
                .attr("y", 0)
                .attr("class", function(d) {
                    return "value";
                })
                .attr("x", d => {
                    return xScale(xValue(d)) + 10;
                })
                .attr("y", 32)
                .attr("font-size", config.player_rank_point_size + 'pt');

        

        var barUpdate = bar
            .transition("2")
            .duration(2990 * interval_time)
            .ease(d3.easeLinear);

        barUpdate
            .select("rect")
            .style("fill", function(d) {
                name = d.name.replace(/\s/g, '');
                return colorByNames[name]
            }) //1. colorScale(d.name)
            .attr("width", d => xScale(xValue(d)));
        if (config.showLabel == true) {
            barUpdate
                .select(".label")
                .attr("class", function(d) {
                    return "label ";
                })
                .style("fill", function(d) {
                    name = d.name.replace(/\s/g, '');
                    return colorByNames[name]
                }) //1. colorScale(d.name)
                .attr("width", d => xScale(xValue(d)));
        }
        
            barUpdate
                .select(".value")
                .attr("class", function(d) {
                    return "value";
                })
                .attr("width", d => xScale(xValue(d)));
        
        barUpdate.select(".barInfo").attr("stroke", function(d) {
            name = d.name.replace(/\s/g, '');
            return colorByNames[name]
        });

        var barInfo = barUpdate
            .select(".barInfo")
            .text(function(d) {
                return d[config.display_inside_the_bar];
            })
            .attr("x", d => {                
                return xScale(xValue(d)) - 10;
            })
            .attr("fill-opacity", function(d) {
                if (xScale(xValue(d)) - 10 < display_barInfo) {
                    return 0;
                }
                return 1;
            })
            .attr("stroke-width", function(d) {
                if (xScale(xValue(d)) - 10 < display_barInfo) {
                    return "0px";
                }
                return "0px";
            });


        
            barUpdate
                .select(".value")
                .tween("text", function(d) {
                    var self = this;

                    // if postfix is blank, do not slice.
                    if (config.postfix == "") {
                        var i = d3.interpolate(parseFloat(self.textContent.replace(/,/g, '')), Number(d.value));
                    } else {
                        var i = d3.interpolate(self.textContent.slice(0 - config.postfix.length), Number(d.value));
                    }

                    var prec = (Number(d.value) + "").split("."),
                        round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
                    // d.value = self.textContent
                    return function(t) {
                        self.textContent = d3.format(format)(
                            Math.round(i(t) * round) / round
                        ) + config.postfix;
                        // d.value = self.textContent
                    };
                })
                .duration(2990 * interval_time)
                .attr("x", d => xScale(xValue(d)) + 10);

        
        avg =
            (Number(currentData[0]["value"]) +
                Number(currentData[currentData.length - 1]["value"])) /
            2;

        var barExit = bar
            .exit()
            .attr("fill-opacity", 1)
            .transition()
            .duration(2500 * interval_time);
        barExit
            .attr("transform", function(d) {
                if (Number(d.value) > avg && allow_up) {
                    return "translate(0," + "-100" + ")";
                }
                return "translate(0," + "2000" + ")";
            })
            .remove()
            .attr("fill-opacity", 0);
        barExit
            .select("rect")
            .attr("fill-opacity", 0)
            .attr("width", xScale(currentData[currentData.length - 1]["value"]));
        
            barExit
                .select(".value")
                .attr("fill-opacity", 0)
                .attr("x", () => {
                    return xScale(currentData[currentData.length - 1]["value"]);
                });
        
        barExit
            .select(".barInfo")
            .attr("fill-opacity", 0)
            .attr("stroke-width", function(d) {
                return "0px";
            })
            .attr("x", () => {                
                return xScale(currentData[currentData.length - 1]["value"]);
            });
        barExit.select(".label").attr("fill-opacity", 0);

        firstTime = false;
    }

    function change() {
        yScale
            .domain(currentData.map(d => d.name).reverse())
            .range([innerHeight, 0]);
        if (animation == "linear") {
            g.selectAll(".bar")
                .data(currentData, function(d) {
                    return d.name;
                })
                .transition("1")
                .ease(d3.easeLinear)
                .duration(baseTime * update_rate * interval_time)
                .attr("transform", function(d) {
                    return "translate(0," + yScale(yValue(d)) + ")";
                });
        } else {
            g.selectAll(".bar")
                .data(currentData, function(d) {
                    return d.name;
                })
                .transition("1")
                .duration(baseTime * update_rate * interval_time)
                .attr("transform", function(d) {
                    return "translate(0," + yScale(yValue(d)) + ")";
                });
        }
    }

    var i = 0;
    var p = config.wait;
    var update_rate = config.update_rate;
    var inter = setInterval(function next() {
        // 空过p回合
        while (p) {
            p -= 1;
            return;
        }
        currentdate = time[i];
        getCurrentData(time[i]);
        i++;

        if (i >= time.length) {
            window.clearInterval(inter);
        }
    }, baseTime * interval_time);
}

//get random color 
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}