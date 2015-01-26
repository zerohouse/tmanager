Date.prototype.getString = function () {
    var day = this.getDate();
    var month = this.getMonth() + 1;
    var year = this.getFullYear();
    var hours = this.getHours();
    var min = this.getMinutes();
    return year + "-" + month + "-" + day + " "+hours+":"+min;
}

Date.prototype.dayString = function () {
    var day = this.getDate();
    var month = this.getMonth() + 1;
    var year = this.getFullYear();
    return year + "-" + month + "-" + day;
}

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

var ifFailsWarring = function (response) {
    if (response.success)
        return;
    alert(response.errorMessage);
}

var timer = {};
var url = {
    refresh: "/agents/refresh",
    newAgent: "/agents/new",
    updateAgent: "/agents/update",
    deleteAgent: "/agents/delete",
    searchAgent: "/agents/search",
    getAgentById: "/agents/addById",
    newSchedule: "/schedule/new",
    updateSchedule: "/schedule/update",
    deleteSchedule: "/schedule/delete",
    newLine: "/line/new",
    updateLine: "/line/update",
    deleteLine: "/line/delete"
};


var app = angular.module('tmanager', ['datePicker', 'ui.bootstrap']);

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

app.controller('headerController', ['$scope', function($scope){
    $scope.link = function(type){
    	var link = '/' + type + '/';
    	var start = angular.element($('table')).scope().start;
    	var end = angular.element($('table')).scope().end;
    	if(start == undefined){
    		document.location.href = link + agentId;
    		return;
    	}
    	if(end == undefined){
    		document.location.href = link + agentId;
    		return;
    	}
    	document.location.href = link + agentId + "/" + start.dayString() + "/" + end.dayString();
    }
}]);

