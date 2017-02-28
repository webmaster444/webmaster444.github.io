d3.json("sample_data.json", function(error, data1) {

    // var csv = d3.csv.parseRows(text);
    // var json = buildHierarchy(csv);
    // createVisualization(json);
    // data1.forEach(function(d) { console.log(d); });
    // console.log(sizeof(data1));
    var task1 = [];
    var json_length = Object.keys(data1).length;
    var machineIds = [];
    for (var i = 1; i <= json_length; i++) {
        // console.log(data1[i].action_list);

        for (var j = 0; j < data1[i].action_list.length; j++) {


            if (data1[i].action_list[j][0] == "operation") {
                task1.push(data1[i].action_list[j]);
            }
        }
    }

    var tasks_length = Object.keys(task1).length;
    for (var i = 0; i < tasks_length; i++) {
        if(i==0){
            machineIds.push(task1[0][1]);
        }

        // console.log(task1[i]);
        if(machineIds.indexOf(task1[i][1])==-1){
            machineIds.push(task1[i][1]);
        }
    }
    // console.log(machineIds);

    var tasks = [{
            "startDate": new Date("Sun Dec 09 01:36:45 EST 2012"),
            "endDate": new Date("Sun Dec 09 02:36:45 EST 2012"),
            "taskName": "E Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 04:56:32 EST 2012"),
            "endDate": new Date("Sun Dec 09 06:35:47 EST 2012"),
            "taskName": "A Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 06:29:53 EST 2012"),
            "endDate": new Date("Sun Dec 09 06:34:04 EST 2012"),
            "taskName": "D Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 05:35:21 EST 2012"),
            "endDate": new Date("Sun Dec 09 06:21:22 EST 2012"),
            "taskName": "P Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 05:00:06 EST 2012"),
            "endDate": new Date("Sun Dec 09 05:05:07 EST 2012"),
            "taskName": "D Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 03:46:59 EST 2012"),
            "endDate": new Date("Sun Dec 09 04:54:19 EST 2012"),
            "taskName": "P Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 04:02:45 EST 2012"),
            "endDate": new Date("Sun Dec 09 04:48:56 EST 2012"),
            "taskName": "N Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"),
            "endDate": new Date("Sun Dec 09 03:58:43 EST 2012"),
            "taskName": "E Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sun Dec 09 01:40:11 EST 2012"),
            "endDate": new Date("Sun Dec 09 03:26:35 EST 2012"),
            "taskName": "A Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sun Dec 09 03:00:03 EST 2012"),
            "endDate": new Date("Sun Dec 09 03:09:51 EST 2012"),
            "taskName": "D Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sun Dec 09 01:21:00 EST 2012"),
            "endDate": new Date("Sun Dec 09 02:51:42 EST 2012"),
            "taskName": "P Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sun Dec 09 01:08:42 EST 2012"),
            "endDate": new Date("Sun Dec 09 01:33:42 EST 2012"),
            "taskName": "N Job",
            "status": "FAILED"
        },
        {
            "startDate": new Date("Sun Dec 09 00:27:15 EST 2012"),
            "endDate": new Date("Sun Dec 09 00:54:56 EST 2012"),
            "taskName": "E Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sun Dec 09 00:29:48 EST 2012"),
            "endDate": new Date("Sun Dec 09 00:44:50 EST 2012"),
            "taskName": "D Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sun Dec 09 07:39:21 EST 2012"),
            "endDate": new Date("Sun Dec 09 07:43:22 EST 2012"),
            "taskName": "P Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 07:00:06 EST 2012"),
            "endDate": new Date("Sun Dec 09 07:05:07 EST 2012"),
            "taskName": "D Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 08:46:59 EST 2012"),
            "endDate": new Date("Sun Dec 09 09:54:19 EST 2012"),
            "taskName": "P Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 09:02:45 EST 2012"),
            "endDate": new Date("Sun Dec 09 09:48:56 EST 2012"),
            "taskName": "N Job",
            "status": "RUNNING"
        },
        {
            "startDate": new Date("Sun Dec 09 08:27:35 EST 2012"),
            "endDate": new Date("Sun Dec 09 08:58:43 EST 2012"),
            "taskName": "E Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sun Dec 09 08:40:11 EST 2012"),
            "endDate": new Date("Sun Dec 09 08:46:35 EST 2012"),
            "taskName": "A Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sun Dec 09 08:00:03 EST 2012"),
            "endDate": new Date("Sun Dec 09 08:09:51 EST 2012"),
            "taskName": "D Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sun Dec 09 10:21:00 EST 2012"),
            "endDate": new Date("Sun Dec 09 10:51:42 EST 2012"),
            "taskName": "P Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sun Dec 09 11:08:42 EST 2012"),
            "endDate": new Date("Sun Dec 09 11:33:42 EST 2012"),
            "taskName": "N Job",
            "status": "FAILED"
        },
        {
            "startDate": new Date("Sun Dec 09 12:27:15 EST 2012"),
            "endDate": new Date("Sun Dec 09 12:54:56 EST 2012"),
            "taskName": "E Job",
            "status": "SUCCEEDED"
        },
        {
            "startDate": new Date("Sat Dec 08 23:12:24 EST 2012"),
            "endDate": new Date("Sun Dec 09 00:26:13 EST 2012"),
            "taskName": "A Job",
            "status": "KILLED"
        }
    ];

    var taskStatus = {
        // "SUCCEEDED": "bar",
        // "FAILED": "bar-failed",
        // "RUNNING": "bar-running",
        // "KILLED": "bar-killed"
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

    // tasks.sort(function(a, b) {
    //     return a.endDate - b.endDate;
    // });
    // var maxDate = tasks[tasks.length - 1].endDate;
    // tasks.sort(function(a, b) {
    //     return a.startDate - b.startDate;
    // });
    // var minDate = tasks[0].startDate;

    var format = "%H:%M";

    var gantt = d3.gantt().taskTypes(machineIds).taskStatus(machineIds).tickFormat(format);
    gantt(task1);
});