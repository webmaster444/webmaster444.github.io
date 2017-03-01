d3.json("sample_data.json", function(error, data1) {
	var config_json = {
		"unit":"min",
		"baseTime":new Date("Sun Dec 09 01:36:45 EST 2012")
	}

    var tasks = [];
    var json_length = Object.keys(data1).length;
    var machineIds = [];
    for (var i = 1; i <= json_length; i++) {
        var box_color = data1[i].caster;
        var box_grade = data1[i].grade;
        var box_index = data1[i].id;

        for (var j = 0; j < data1[i].action_list.length; j++) {
            if (data1[i].action_list[j][0] == "operation") {
                data1[i].action_list[j]["kindOfTask"] = data1[i].action_list[j][0];
                data1[i].action_list[j]["machineId"] = data1[i].action_list[j][1];
                data1[i].action_list[j]["slot"] = data1[i].action_list[j][2];
                
                var temp_time = new Date(config_json.baseTime);
                var st_time = new Date(temp_time.setMinutes(temp_time.getMinutes() + data1[i].action_list[j][3]));
                data1[i].action_list[j]["startDate"] = temp_time;
                st_time.setMinutes(temp_time.getMinutes() + data1[i].action_list[j][4]);
                data1[i].action_list[j]["endDate"] = st_time;   

                data1[i].action_list[j]["caster"] = box_color;
                data1[i].action_list[j]["grade"] = box_grade;
                data1[i].action_list[j]["boxIndex"] = box_index;
                data1[i].action_list[j]["duration"] = data1[i].action_list[j][4];

                // console.log(data1[i].action_list[j]);

                tasks.push(data1[i].action_list[j]);
            }
        }
    }

    var tasks_length = Object.keys(tasks).length;
    for (var i = 0; i < tasks_length; i++) {
        if(i==0){
            machineIds.push(tasks[0].machineId);
        }

        if(machineIds.indexOf(tasks[i].machineId)==-1){
            machineIds.push(tasks[i].machineId);
        }
    }

console.log(machineIds);
    var taskStatus = {
        "BIC1": "bar",
		"LF3":"bar-failed",
		"EAF3":"bar-running",
		"LF2":"bar-failed",
		"EAF6":"bar",
		"EAF5":"bar-failed",
		"LF4":"bar-killed", 
		"EAF2":"bar-running",
		"SLC3":"bar-failed",
		"BLC1":"bar",
		"BIC2":"bar-killed",
		"SLC1":"bar-running",
		"VD1":"bar",
		"LF1":"bar-killed",
		"VD2":"bar-running"
    };

    var taskNames = ["D Job", "P Job", "E Job", "A Job", "N Job"];

    var format = "%H:%M";

    var gantt = d3.gantt().taskTypes(machineIds).taskStatus(machineIds).tickFormat(format);
    gantt(tasks);
});