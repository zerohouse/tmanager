var app = angular.module('onemanager', ['datePicker', 'ui.bootstrap']);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.controller('timetable', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
    $scope.selectedHead = {};
    $scope.selectedBody = {};

    function postRequest(url, data) {
        return {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "="
                    + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: data
        }
    }

    var timer = {};
    var url = {
        refresh: "/agents/between",
        newAgent: "/agents/new",
        updateAgent: "/agents/update",
        deleteAgent: "/agents/delete",
        newSchedule: "/schedule/new",
        updateSchedule: "/schedule/update",
        deleteSchedule: "/schedule/delete",
        newLine: "/line/new",
        updateLine: "/line/update",
        deleteLine: "/line/delete"
    };

    var request = function (type, response, data) {
        clearTimeout(timer[type]);
        timer[type] = setTimeout(function () {
            $http(postRequest(url[type], data)).success(function (result) {
                response(result);
            });
        }, 1000);
    };


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
                    if (ui.position.left == ui.originalPosition.left)
                        return;
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
                    if (ui.position.left == ui.originalPosition.left)
                        return;
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

    //리플라이 제출
    $scope.submitReply = function () {
        if ($scope.selectedSchedule.replies == undefined)
            $scope.selectedSchedule.replies = [];
        $scope.selectedSchedule.replies.push($scope.newReply);
        $scope.newReply = "";
    };
    $scope.newReply = {};

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
    var refresh = function () {
        var quantum = [];
        if ($scope.start == undefined) {
            return;
        }
        if ($scope.end == undefined) {
            return;
        }
        var start = new Date($scope.start.getTime());
        var end = new Date($scope.end.getTime());

        while (start <= end) {
            var each = new Date(start.getTime());
            quantum.push(each);
            start.setTime(start.getTime() + unit().tdHeightTime);
        }
        $scope.timeQuantums = quantum;
        request('refresh', function (response) {
            $scope.agents = response;
            watchSchedulesAndLines();
        });
        setDraggableAndResizable();
    };


    $scope.stop = function (event) {
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
        this.id = 0;
        this.name = "";
        this.schedules = [];
        this.lines = [];
    };

    var scheduleProto = function () {
        this.agentId = 0;
        this.startTime = new Date();
        this.endTime = new Date();
        this.head = "";
        this.body = "";
    };

    var lineProto = function () {
        this.time = new Date();
        this.head = "";
        this.body = "";
    };

    // 에이전트 추가
    $scope.newAgent = function () {
        request('newAgent', function (response) {
            var agent = new agentProto();
            agent.id = response.id;
            $scope.agents.push(agent);
            $scope.$watch(function (scope) {
                return agent.name;
            }, updateAgent(agent.id, agent.name));
        });
    };


    //에이전트 삭제 (선택된것)
    $scope.deleteAgent = function (agent) {
        if (!confirm("이 리스트와 리스트의 스케줄이 모두 삭제됩니다"))
            return;
        request('deleteAgent', function (response) {
            if (!response.success)
                return;
            var index = $scope.agents.indexOf(agent);
            $scope.agents.splice(index, index + 1);
        }, {agentId: agent.id});
    };


    //새로운 일정
    $scope.newSchedule = function (agent) {
        if ($scope.timeQuantums == undefined)
            return;
        var schedule = new scheduleProto();
        schedule.agentId = agent.id;
        schedule.startTime = new Date($scope.timeQuantums[0].getTime());
        schedule.endTime = new Date($scope.timeQuantums[0].getTime() + unit().tdHeightTime);
        request('newSchedule', function (response) {
            schedule.id = response.id;
            agent.schedules.push(schedule);
            $scope.$watch(function (scope) {
                return schedule;
            }, updateSchedule(schedule));
            setDraggableAndResizable();
        }, {schedule: schedule});
    };

    //새로운 라인
    $scope.newLine = function (agent) {
        if ($scope.timeQuantums == undefined)
            return;
        var line = new lineProto();
        line.agentId = agent.id;
        line.time = new Date($scope.timeQuantums[0].getTime());
        agent.lines.push(line);
        setDraggableAndResizable();
        request('newLine', function (response) {
            line.id = line.id;
            agent.schedules.push(line);
            $scope.$watch(function (scope) {
                return line;
            }, updateLine(line));
            setDraggableAndResizable();
        }, {line: line});
    };


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


    // 워치 변수들
    $scope.$watch(function (scope) {
        return scope.start;
    }, refresh);

    $scope.$watch(function (scope) {
        return scope.end;
    }, refresh);

    $scope.$watch(function (scope) {
        return scope.scale;
    }, refresh);


    var watchSchedulesAndLines = function () {
        var keys = Object.keys($scope.agents);
        for (var i = 0; i < keys.length; i++) {
            $scope.agents[keys[i]].modify = false;
            for (var j = 0; j < $scope.agents[keys[i]].schedules.length; j++) {
                $scope.$watch(function (scope) {
                    return scope.agents[keys[i]].schedules[j];
                }, updateSchedule($scope.agents[keys[i]].schedules[j]));
            }
            for (var j = 0; j < $scope.agents[keys[i]].lines.length; j++) {
                $scope.$watch(function (scope) {
                    return scope.agents[keys[i]].lines[j];
                }, updateLine($scope.agents[keys[i]].lines[j]));
            }
        }
    };

    var ifFailsWarring = function (response) {
        if (response.success)
            return;
        alert(response.errorMessage);
    }

    var updateAgent = function (agentid, agentname) {
        request('updateAgent', ifFailsWarring, {agent: {id: agentid, name: agentname}});
    };

    var updateSchedule = function (schedule) {
        request('updateSchedule', ifFailsWarring, {schedule: schedule});
    };

    var updateLine = function (line) {
        request('updateLine', ifFailsWarring, {line: line});
    };

    // 숨기기 기능
    $('body').click(function () {
        $scope.selectedBody.modify = false;
        $scope.selectedHead.modify = false;

        var keys = Object.keys($scope.agents);

        for (var i = 0; i < keys.length; i++) {
            $scope.agents[keys[i]].modify = false;
            for (var j = 0; j < $scope.agents[keys[i]].schedules.length; j++) {
                $scope.agents[keys[i]].schedules[j].modify = false;
            }
            for (var j = 0; j < $scope.agents[keys[i]].lines.length; j++) {
                $scope.agents[keys[i]].lines[j].modify = false;
            }
        }
        $scope.$apply();
    });

    //스케줄 보이기
    $scope.showSchedule = function (schedule) {
        if (noClick) { //드래그시 이벤트 방지
            noClick = false;
            return;
        }
        $('#schedule').modal('show');
        $scope.selectedSchedule = schedule;
    };

    // 텍스트 에어리어 자동 크기 조절
    $('textarea').autosize();


}]);
