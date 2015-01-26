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
    	var start = angular.element($('#schedule')).scope().start
    	var end = angular.element($('#schedule')).scope().end
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