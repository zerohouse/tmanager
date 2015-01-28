
app.controller('timetable', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
    
	
	var request = function (type, response, data) {
		$scope.updating = true;
	    clearTimeout(timer[type]);
	    timer[type] = setTimeout(function () {
	        $http(postRequest("/api" + url[type], data)).success(function (result) {
	            response(result);
	            $scope.updating = false;
	        });
	    }, 300);
	};
	
    $scope.setting = setting;
    

    //스케줄 보이기
    $scope.showSchedule = function (schedule) {
        $('#schedule').modal('show');
        angular.element($('#schedule')).scope().setSelected(schedule);
    };


    //스케줄 스타일 처리
    $scope.style = {};
    $scope.style.schedule = function (schedule) {
        if (schedule == undefined)
            return;
        var style = {};
        style.width = $('td:last').width();
        var duration = schedule.endTime - schedule.startTime;
        style.height = (duration / unit().tdHeightTime) * blockHeight;
        if ($scope.timeQuantums == undefined)
            style.top = blockHeight;
        else {
            var start = schedule.startTime - $scope.timeQuantums[0];
            style.top = (start / unit().tdHeightTime) * blockHeight + 36;
        }
        return style;
    };

    $scope.style.line = function (line) {
        var style = {};
        style.width = $('td:last').width();
        if ($scope.timeQuantums == undefined)
            style.top = blockHeight;
        else {
            var start = line.time - $scope.timeQuantums[0];
            style.top = (start / unit().tdHeightTime) * blockHeight + 36;
        }
        return style;
    };

    $scope.style.td = function (schedule) {
        var style = {};
        style.height = blockHeight;
        return style;
    };
    
    
   	$scope.weeks = [];
	var days = {};
	
    //업데이트
    var refresh = function (newVal) {
    	$scope.weeks = [];
    	days = {};
        if ($scope.start == undefined) {
            return;
        }
        if ($scope.end == undefined) {
            return;
        }
        var start = new Date($scope.start);
        var end = new Date($scope.end);

        var week = [];
        var size = start.getDay()-1;
        if(size==-1)
        	size = 6;
        for(var i=0; i< size; i++){
        	week.push({});
        }
        while (start <= end) {
            var each = {
            	date : new Date(start),
            	schedules : [],
            	lines : [],
            };
            days[start.dayString()] = each;
            week.push(each);
            if(start.getDay()==0){
            	$scope.weeks.push(week);
            	week = [];
            }
            start.setDate(start.getDate() + 1);
        }
        $scope.weeks.push(week);
        if(newVal<6){
        	return;
        }
        $('html').addClass("loading");
        request('refresh', function (response) {
            $scope.agents = response;
            agentsParseDate();
            scheduleIntoDays();
            $('html').removeClass("loading");
        }, {start: $scope.start.getTime(), end: $scope.end.getTime(), agentId: $scope.setting.agentId});
    };
   
    var agentsParseDate = function(){
    	for (var i = 0; i < $scope.agents.length; i++) {
            for (var j = 0; j < $scope.agents[i].schedules.length; j++) {
                $scope.agents[i].schedules[j].startTime = new Date($scope.agents[i].schedules[j].startTime);
                $scope.agents[i].schedules[j].endTime = new Date($scope.agents[i].schedules[j].endTime);
            }
            for (var j = 0; j < $scope.agents[i].lines.length; j++) {
            	$scope.agents[i].lines[j].time = new Date($scope.agents[i].lines[j].time);
            }
        }
    }
    
    var scheduleIntoDays = function(){
    	for (var i = 0; i < $scope.agents.length; i++) {
            for (var j = 0; j < $scope.agents[i].schedules.length; j++) {
                var startTime = new Date($scope.agents[i].schedules[j].startTime);
                var endTime = new Date($scope.agents[i].schedules[j].endTime);
                var k = 0;
                while(startTime <= endTime){
                	var schedule = {};
                	schedule.startTime = new Date($scope.agents[i].schedules[j].startTime);
                	schedule.endTime = new Date($scope.agents[i].schedules[j].endTime);
                	schedule.name = $scope.agents[i].schedules[j].name;
                	if(k!=0){
                		schedule.startTime.setHours(0);
                		schedule.startTime.setMinutes(0);
                	}
                	if(startTime.getDate() + 1 < endTime.getDate()){
                		schedule.endTime.setHours(23);
                		schedule.endTime.setMinutes(59);
                	}
                	days[startTime.dayString()].schedules.push(schedule);
                	startTime.setDate(startTime.getDate()+1);
                	k++;
                }
            }
            for (var j = 0; j < $scope.agents[i].lines.length; j++) {
            	days[$scope.agents[i].lines[j].time.dayString()].lines.push($scope.agents[i].lines[j]);
            }
        }
    }

    // 워치 변수들
    $scope.$watch('start', refresh);

    $scope.$watch('end', refresh);
    
    $scope.start= new Date();
    $scope.end = new Date($scope.start.getTime() + 60*60*1000*24*7);
   
    if(setting.dateStart.length>1)
    	$scope.start = new Date(setting.dateStart);
    if(setting.dateEnd.length>1)
    	$scope.end = new Date(setting.dateEnd);
    
    $scope.stop = function (event) {
        if (event == undefined)
            return;
        event.stopPropagation();
    };

    $scope.toggleModify = function (object) {
        if (object.modify) {
            object.modify = false;
            return;
        }
        object.modify = true;
    };

    $scope.show = {};

    $scope.toggle = function (string) {
        if ($scope.show[string]) {
            $scope.show[string] = false;
            return;
        }
        $scope.show[string] = true;
    };


    //에이전트
    $scope.agents = [];

    $scope.updateAgent = function (agent) {
        agent.name = agent.newname;
        request('updateAgent', ifFailsWarring, {agent: JSON.stringify({id: agent.id, name: agent.name})});
    };

    $scope.updateSchedule = function (schedule) {
    	var forSend = {};
    	forSend.id = schedule.id;
        forSend.head = schedule.newhead;
        forSend.body = schedule.newbody;
        schedule.head = schedule.newhead;
        schedule.body = schedule.newbody;
        request('updateSchedule', ifFailsWarring, {schedule: JSON.stringify(forSend)});
    };

    $scope.updateLine = function (line, drag) {
    	var forSend = {};
    	forSend.id = line.id;
        forSend.head = line.newhead;
        forSend.body = line.newbody;
        line.head = line.newhead;
        line.body = line.newbody;
        request('updateLine', ifFailsWarring, {line: JSON.stringify(forSend)});
    };


    // 숨기기 기능
    $('body').click(function () {

        for (var i = 0; i < $scope.agents.length; i++) {
            $scope.agents[i].modify = false;
            for (var j = 0; j < $scope.agents[i].schedules.length; j++) {
                $scope.agents[i].schedules[j].modify = false;
            }
            for (var j = 0; j < $scope.agents[i].lines.length; j++) {
                $scope.agents[i].lines[j].modify = false;
            }
        }
        $scope.$apply();
    });
    
    
    //여기서부터 모달 부분
    $scope.setSelected = function(selected){
		$scope.selectedSchedule = selected;
	}
	
	$scope.selectedHead = {};
    $scope.selectedBody = {};
    

	//스케줄 or 라인 삭제 (선택된것)
    $scope.deleteSelected = function () {
        if (!confirm("스케줄이 삭제됩니다"))
            return;
        if ($scope.selectedSchedule.startTime == undefined) {
            request('deleteLine', function (response) {
                var keys = Object.keys($scope.agents);
                for (var i = 0; i < keys.length; i++) {
                    var index = $scope.agents[keys[i]].lines.indexOf($scope.selectedSchedule);
                    if (index != -1) {
                        $scope.agents[keys[i]].lines.splice(index, index + 1);
                        return;
                    }
                }
            }, {lineId: $scope.selectedSchedule.id});
            return;
        }
        request('deleteSchedule', function (response) {
            var keys = Object.keys($scope.agents);
            for (var i = 0; i < keys.length; i++) {
                var index = $scope.agents[keys[i]].schedules.indexOf($scope.selectedSchedule);
                if (index != -1) {
                    $scope.agents[keys[i]].schedules.splice(index, index + 1);
                    return;
                }
            }
        }, {scheduleId: $scope.selectedSchedule.id});
    };
    
    // 텍스트 에어리어 자동 크기 조절
    $('textarea').autosize();

    //리플라이 제출
    $scope.submitReply = function () {
        if ($scope.selectedSchedule.replies == undefined)
            $scope.selectedSchedule.replies = [];
        $scope.selectedSchedule.replies.push($scope.newReply);
        $scope.newReply = "";
    };
    $scope.newReply = {};
    
    $('body').click(function () {
        $scope.selectedBody.modify = false;
        $scope.selectedHead.modify = false;
    });

}]);
