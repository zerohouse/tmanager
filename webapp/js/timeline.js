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

    // 드래그 / 리사이즈 세팅
    var setDraggableAndResizable = function () {
        $timeout(function () {
            var width = $('td:last').width() + 16;

            $('.schedule').draggable({
                start: function () {
                    noClick = true;
                },
                grid: [width, unit().thirtyMin],
                drag: function (event, ui) {
                    var thirty = 30 * 60 * 1000;
                    var diff = (ui.position.top - 36) / unit().thirtyMin * thirty;
                    var startTime = angular.element($(this)).scope().schedule.startTime.getTime();
                    var endTime = angular.element($(this)).scope().schedule.endTime.getTime();
                    var newStartTime = $scope.timeQuantums[0].getTime() + diff;
                    var newEndTime = newStartTime + endTime - startTime;
                    angular.element($(this)).scope().schedule.startTime.setTime(newStartTime);
                    angular.element($(this)).scope().schedule.endTime.setTime(newEndTime);
                    angular.element($(this)).scope().$apply();
                },
                stop: function (event, ui) {
                	$scope.updateSchedule(angular.element($(this)).scope().schedule, true);
                    if (ui.position.left == ui.originalPosition.left)
                        return;
                    if(angular.element($(this)).scope().agent.id!=angular.element($(this)).scope().schedule.agentId){
                    	$(this).css('left', ui.originalPosition.left);
                    	alert("하위 그룹의 스케줄입니다. 옮길 수 없습니다.")
                    	return;
                    }
                    var diff = (ui.position.left - ui.originalPosition.left) / width;
                    var agentIndex = $scope.agents.indexOf(angular.element($(this)).scope().agent);
                    var scheduleIndex = $scope.agents[agentIndex].schedules.indexOf(angular.element($(this)).scope().schedule);
                    if ($scope.agents[agentIndex + diff] == undefined) {
                        $(this).css('left', ui.originalPosition.left);
                        return;
                    }
                    var moved = $scope.agents[agentIndex].schedules.splice(scheduleIndex, scheduleIndex + 1)[0];
                    moved.agentId = $scope.agents[agentIndex + diff].id;
                    $scope.agents[agentIndex + diff].schedules.push(moved);
                    $scope.updateSchedule(angular.element($(this)).scope().schedule, true);
                    setDraggableAndResizable();
                }
            }).resizable({
                grid: unit().thirtyMin,
                resize: function (event, ui) {
                    ui.size.width = width - 16;
                    var diff = (ui.size.height + 16) / blockHeight * unit().tdHeightTime;
                    var startTime = angular.element($(this)).scope().schedule.startTime.getTime();
                    angular.element($(this)).scope().schedule.endTime.setTime(startTime + diff);
                    angular.element($(this)).scope().$apply();
                    $scope.updateSchedule(angular.element($(this)).scope().schedule, true);
                    noClick = true;
                }
            });

            $('.line').draggable({
                start: function () {
                    noClick = true;
                },
                grid: [width, unit().thirtyMin],
                drag: function (event, ui) {
                    var thirty = 30 * 60 * 1000;
                    var diff = (ui.position.top - 36) / unit().thirtyMin * thirty;
                    var newTime = $scope.timeQuantums[0].getTime() + diff;
                    angular.element($(this)).scope().line.time.setTime(newTime);
                    angular.element($(this)).scope().$apply();
                },
                stop: function (event, ui) {
                	$scope.updateLine(angular.element($(this)).scope().line, true);
                    if (ui.position.left == ui.originalPosition.left)
                        return;
                    if(angular.element($(this)).scope().agent.id!=angular.element($(this)).scope().line.agentId){
                    	$(this).css('left', ui.originalPosition.left);
                    	alert("하위 그룹의 스케줄입니다. 옮길 수 없습니다.")
                    	return;
                    }
                    var diff = (ui.position.left - ui.originalPosition.left) / width;
                    var agentIndex = $scope.agents.indexOf(angular.element($(this)).scope().agent);
                    var lineIndex = $scope.agents[agentIndex].lines.indexOf(angular.element($(this)).scope().line);
                    if ($scope.agents[agentIndex + diff] == undefined) {
                        $(this).css('left', ui.originalPosition.left);
                        return;
                    }
                    var moved = $scope.agents[agentIndex].lines.splice(lineIndex, lineIndex + 1)[0];
                    moved.agentId = $scope.agents[agentIndex + diff].id;
                    $scope.agents[agentIndex + diff].lines.push(moved);
                    $scope.updateLine(angular.element($(this)).scope().line, true);
                    setDraggableAndResizable();
                }
            })
        });
    }

    var noClick = false;

    // 원자(시간 최소단위)처리
    // 6시간 > 12시간 > 1일 > 일주일 > 한달
    // 기본 조절 단위는 무조건 30분
    $scope.scale = 3; //(default : day)
    var block = 48;
    var blockHeight = block * 2;

    $scope.expand = function () {
        if (blockHeight < block * 3) {
            blockHeight += block;
            return;
        }
        if ($scope.scale < 2)
            return;
        blockHeight = block;
        $scope.scale--;
    };

    $scope.reduce = function () {
        if (blockHeight > block) {
            blockHeight -= block;
            return;
        }
        if ($scope.scale > 4)
            return;
        blockHeight = block * 3;
        $scope.scale++;
    };

    $scope.durationName = function () {
        switch ($scope.scale) {
            case 1:
                return "반나절 ";
            case 2:
                return "나절 ";
            case 3:
                return "하루 ";
            case 4:
                return "주 ";
            case 5:
                return "보름 ";
        }
    };

    function unit() {
        var unit = {};
        var second = 1000;
        var min = second * 60;
        var hour = min * 60;
        var day = hour * 24;
        switch ($scope.scale) {
            case 1:
                unit.tdHeightTime = 6 * hour;
                break;
            case 2:
                unit.tdHeightTime = 12 * hour;
                break;
            case 3:
                unit.tdHeightTime = day;
                break;
            case 4:
                unit.tdHeightTime = day * 7;
                break;
            case 5:
                unit.tdHeightTime = day * 15;
                break;
        }
        unit.thirtyMin = blockHeight / unit.tdHeightTime * min * 30;
        return unit;
    }
    
    //스케줄 보이기
    $scope.showSchedule = function (schedule) {
        if (noClick) { //드래그시 이벤트 방지
            noClick = false;
            return;
        }
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




    
    //업데이트
    var refresh = function (newVal) {
        var quantum = [];
        if ($scope.start == undefined) {
            return;
        }
        if ($scope.end == undefined) {
            return;
        }
        var start = new Date($scope.start);
        var end = new Date($scope.end);
        if(!isValidDate(start))
        	return;
        if(!isValidDate(end))
        	return;
        
        	
        while (start <= end) {
            var each = new Date(start);
            quantum.push(each);
            start.setTime(start.getTime() + unit().tdHeightTime);
        }
        $scope.timeQuantums = quantum;
        if(newVal<6){
        	return;
        }
        $('html').addClass("loading");
        request('refresh', function (response) {
            $scope.agents = response;
            agentsParseDate();
            setDraggableAndResizable();
            $('html').removeClass("loading");
        }, {start: $scope.start.getTime(), end: $scope.end.getTime(), agentId: $scope.setting.agentId});
        
        function isValidDate(d) {
        	  if ( Object.prototype.toString.call(d) !== "[object Date]" )
        	    return false;
        	  return !isNaN(d.getTime());
        	}
    };
    
    $scope.refresh = refresh;

    // 워치 변수들
    $scope.$watch('start', refresh);

    $scope.$watch('end', refresh);

    $scope.$watch('scale', refresh);
    
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

    var agentProto = function () {
        this.name = "";
        this.schedules = [];
        this.lines = [];
    };

    //검색
    $scope.search = function(){
    	possible = false;
    	if($scope.keyword==""){
    		$scope.searchResults = [];
    		return;
		}
    	request('searchAgent', function (response) {
        	if($scope.keyword==""){
        		$scope.searchResults = [];
        		return;
    		}
    		$scope.searchResults = response;
    		if(response.length==0){
    			possible = true;
    			return;
    		}
    		for(var i=0; i< response.length;i++){
    			if(response[i][0]==$scope.keyword)
    				return;
    		}
    		possible = true;
        }, {keyword: $scope.keyword});
    }
    
    var possible = false;
    $scope.newAgentPossible = function (){
    	if(!possible)
    		return false;
    	if(!/^[A-Za-z][A-Za-z0-9]*$/.test($scope.keyword))
    		return false;
    	return true;
    }
    
    // 에이전트 추가
    $scope.newAgent = function () {
    	if(!$scope.newAgentPossible())
    		return;
        request('newAgent', function (response) {
        	if(response.errorMessage){
        		alert(response.errorMessage)
        		return;
        	}
        	response.schedules = [];
        	response.lines = [];
            $scope.agents.push(response);
            possible = false;
        }, {agentId: $scope.setting.agentId, childId: $scope.keyword});
    };
    
    $scope.addById = function(id){
        request('getAgentById', function (response) {
        	if(response.errorMessage){
        		alert(response.errorMessage);
        		return;
        	}
            $scope.agents.push(response);
            agentsParseDate();
            setDraggableAndResizable();
        }, {start: $scope.start.getTime(), end: $scope.end.getTime(), agentId: id, parentId: $scope.setting.agentId});
    }


    //에이전트 삭제 (선택된것)
    $scope.deleteAgent = function (agent) {
        if (!confirm("스케줄러가 삭제됩니다"))
            return;
        request('deleteAgent', function (response) {
            if (!response.success)
                return;
            var index = $scope.agents.indexOf(agent);
            $scope.agents.splice(index, index + 1);
        }, {agentRelation: JSON.stringify({parent: $scope.setting.agentId, child: agent.id})});
    };


    //새로운 일정
    $scope.newSchedule = function (agent) {
        if ($scope.timeQuantums == undefined)
            return;
        var schedule = {};
        schedule.agentId = agent.id;
        schedule.startTime = new Date($scope.timeQuantums[0].getTime());
        schedule.endTime = new Date($scope.timeQuantums[0].getTime() + unit().tdHeightTime);
        var forSend = {};
        forSend.agentId = agent.id;
        forSend.startTime = schedule.startTime.getString();
        forSend.endTime = schedule.endTime.getString();
        request('newSchedule', function (response) {
        	if(response.errorMessage){
        		alert(response.errorMessage);
        		return;
        	}
        	schedule.id = response.id;
        	schedule.ownerId = response.id;
            agent.schedules.push(schedule);
            setDraggableAndResizable();
        }, {schedule: JSON.stringify(forSend)});
    };

    //새로운 라인
    $scope.newLine = function (agent) {
        if ($scope.timeQuantums == undefined)
            return;
        var line = {};
        line.agentId = agent.id;
        line.time = new Date($scope.timeQuantums[0].getTime());
        var forSend = {};
        forSend.agentId = agent.id;
        forSend.time = line.time.getString();
        request('newLine', function (response) {
        	if(response.errorMessage){
        		alert(response.errorMessage);
        		return;
        	}
            line.id = response.id;
            line.ownerId = response.id;
            agent.lines.push(line);
            setDraggableAndResizable();
        }, {line: JSON.stringify(forSend)});
    };

    

    //$scope.$watchGroup -> angular 버전이 낮아서 아직 지원 안함..ㅜ

    $scope.updateAgent = function (agent) {
        agent.name = agent.newname;
        request('updateAgent', ifFailsWarring, {agent: JSON.stringify({id: agent.id, name: agent.name})});
    };

    $scope.updateSchedule = function (schedule, drag) {
    	var forSend = {};
    	forSend.id = schedule.id;
    	forSend.agentId = schedule.agentId;
        if (!drag) {
        	forSend.head = schedule.newhead;
        	forSend.body = schedule.newbody;
        	schedule.head = schedule.newhead;
        	schedule.body = schedule.newbody;
        	request('updateSchedule', ifFailsWarring, {schedule: JSON.stringify(forSend)});
        	return;
        }
        forSend.agentId = schedule.agentId;
        forSend.startTime = schedule.startTime.getString();
        forSend.endTime = schedule.endTime.getString();
        request('updateSchedule', ifFailsWarring, {schedule: JSON.stringify(forSend)});
    };

    $scope.updateLine = function (line, drag) {
    	var forSend = {};
    	forSend.id = line.id;
    	forSend.agentId = line.agentId;
        if (!drag) {
        	forSend.head = line.newhead;
        	forSend.body = line.newbody;
        	line.head = line.newhead;
        	line.body = line.newbody;
        	request('updateLine', ifFailsWarring, {line: JSON.stringify(forSend)});
        	return;
        }
        forSend.agentId = line.agentId;
        forSend.time = line.time.getString();
        request('updateLine', ifFailsWarring, {line: JSON.stringify(forSend)});
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
    
    // 스케줄 각자의 링크로 연결
    $scope.toChildLink = function(agent){
    	if(agent==undefined)
    		return;
    	var link = '/tmanager/';
    	var start = $scope.start;
    	var end = $scope.end;
    	if(start == undefined){
    		document.location.href = link + agent.id;
    		return;
    	}
    	if(end == undefined){
    		document.location.href = link + agent.id;
    		return;
    	}
    	document.location.href = link + agent.id + "/" + start.dayString() + "/" + end.dayString();
    }
    
    $scope.link = function(agent){
    	if(agent==undefined)
    		return;
    	var link = document.location.origin + '/tmanager/';
    	var start = $scope.start;
    	var end = $scope.end;
    	if(start == undefined){
    		return link + agent.id;
    	}
    	if(end == undefined){
    		return link + agent.id;
    	}
    	return link + agent.id + "/" + start.dayString() + "/" + end.dayString();
    }

    
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
