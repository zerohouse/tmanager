Date.prototype.getFormattedString = function () {
    var day = this.getDate();
    var month = this.getMonth() + 1;
    var year = this.getFullYear();
    return year + "-" + month + "-" + day;
}

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

app.controller('timetable', ['$scope', '$timeout', function ($scope, $timeout) {

    // 데이트 처리
    var newDate = function (date) {
        if (date == undefined)
            return;
        return new Date(date.getFormattedString());
    }

    $scope.selectedHead = {};
    $scope.selectedBody = {};


    // 드래그 / 리사이즈 세팅
    var setDraggableAndResizable = function () {
        $timeout(function () {
            var timeSize = $scope.style.height / 48;

            var width = $('td:last').width() + 16;

            $('.schedule').draggable({
                start: function () {
                    noClick = true;
                },
                grid: [width, timeSize],
                drag: function (event, ui) {
                    var thirty = 30 * 60 * 1000;
                    var diff = (ui.position.top - 36) / timeSize * thirty;
                    var startTime = angular.element($(this)).scope().schedule.startTime.getTime();
                    var endTime = angular.element($(this)).scope().schedule.endTime.getTime();
                    var newStartTime = $scope.days[0].date.getTime() + diff;
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
                    var scheduleIndex = $scope.agents[agentIndex].schedule.indexOf(angular.element($(this)).scope().schedule);
                    if ($scope.agents[agentIndex + diff] == undefined) {
                        $(this).css('left', ui.originalPosition.left);
                        return;
                    }
                    $scope.agents[agentIndex + diff].schedule.push($scope.agents[agentIndex].schedule.splice(scheduleIndex, scheduleIndex + 1)[0]);
                    setDraggableAndResizable();
                }
            }).resizable({
                grid: timeSize,
                resize: function (event, ui) {
                    ui.size.width = width - 16;
                    console.log(timeSize);
                    console.log(ui.size.height);
                    var day = 1000 * 60 * 60 * 24;
                    var diff = (ui.size.height + 16) / $scope.style.height * day;
                    var startTime = angular.element($(this)).scope().schedule.startTime.getTime();
                    angular.element($(this)).scope().schedule.endTime.setTime(startTime + diff);
                    angular.element($(this)).scope().$apply();
                }
            });
        });
    }


    //업데이트
    var update = function () {
        var days = [];
        var start = newDate($scope.start);

        var end = newDate($scope.end);
        if (start == undefined) {
            return;
        }
        if (end == undefined) {
            return;
        }

        while (start <= end) {
            var each = new Day(newDate(start));
            days.push(each);
            start.setDate(start.getDate() + 1);
        }

        $scope.days = days;


        var noClick = false;

        //스케줄 보이기
        $scope.showSchedule = function (schedule) {
            if (noClick) { //드래그시 이벤트 방지
                noClick = false;
                return;
            }
            $('#schedule').modal('show');
            $scope.selectedSchedule = schedule;
        }
        setDraggableAndResizable();
    }

    var Day = function (date) {
        this.date = date;
    }

    $scope.$watch(function (scope) {
        return scope.start;
    }, update);

    $scope.$watch(function (scope) {
        return scope.end;
    }, update);


    $scope.stop = function (event) {
        event.stopPropagation();
    }

    $scope.toggle = function (agent) {
        if (agent.modify) {
            agent.modify = false;
            return;
        }
        agent.modify = true;
    }

    //에이전트
    $scope.agents = [{
        name: "철수",
        schedule: [
            {
                id: 1,
                startTime: new Date("2015-01-23 05:15:00"),
                endTime: new Date("2015-01-25 00:00:00"),
                head: "일1",
                body: "내용"
            },
            {
                id: 2,
                startTime: new Date("2015-01-26 00:00:00"),
                endTime: new Date("2015-01-28 00:00:00"),
                head: "일2",
                body: "내용"
            }
        ]
    }, {
        name: "영희",
        schedule: []
    }, {
        name: "그물",
        schedule: []
    }];


    //스케줄 처리
    var dayHeight = 96;

    $scope.style = {};
    $scope.style.height = 0;
    $scope.style.schedule = function (schedule) {
        var day = 1000 * 60 * 60 * 24;
        $scope.style.height = $('td:last').height() + 16/*padding*/ + 1/*border*/;
        var style = {};
        style.width = $('td:last').width();
        var diff = Math.abs(schedule.startTime - schedule.endTime);
        style.height = (diff / day) * $scope.style.height;
        if ($scope.days == undefined)
            style.top = $scope.style.height;
        else {
            diff = schedule.startTime - $scope.days[0].date;
            style.top = (diff / day) * $scope.style.height + 36;
        }
        return style;
    }

    $scope.style.td = function (schedule) {
        var style = {};
        style.height = dayHeight;
        return style;
    }

    $scope.style.plus = function () {
        dayHeight += 48;
    }

    $scope.style.minus = function () {
        if (dayHeight <= 48)
            return;
        dayHeight -= 48;
    }


    //새로운 일정
    $scope.newSchedule = function (agent) {
        if ($scope.days == undefined)
            return;
        agent.schedule.push(new scheduleProto());
        setDraggableAndResizable();
    }

    // 숨기기 기능
    $('body').click(function () {
        $scope.selectedBody.modify = false;
        $scope.selectedHead.modify = false;

        var keys = Object.keys($scope.agents);

        for (var i = 0; i < keys.length; i++) {
            $scope.agents[keys[i]].modify = false;
            for (var j = 0; j < $scope.agents[keys[i]].schedule.length; j++) {
                $scope.agents[keys[i]].schedule[j].modify = false;
            }
        }
        $scope.$apply();
    });

    //삭제 (선택된것)
    $scope.deleteSelected = function () {
        var keys = Object.keys($scope.agents);

        for (var i = 0; i < keys.length; i++) {
            var index = $scope.agents[keys[i]].schedule.indexOf($scope.selectedSchedule);
            if (index != -1) {
                $scope.agents[keys[i]].schedule.splice(index, index + 1);
                return;
            }

        }
    }


    function scheduleProto() {
        this.startTime = new Date($scope.days[0].date.getTime());
        this.endTime = new Date($scope.days[0].date.getTime() + 60 * 60 * 1000 * 24);
        this.head = "";
        this.body = "";
    }
}]);
