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
    deleteLine: "/line/delete",
    login:"/users/login",
    logout:"/users/logout",
    register:"/users/register"
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

app.controller('loginController', ['$scope', '$http', function($scope, $http){
	$scope.logged = logged;
	
	
	var regexTest = function(){
		var regex = /^([a-zA-Z0-9_-]){4,25}$/;
		if(!regex.test($scope.user.id)&&regex.test($scope.user.password)){
			$scope.errorMessage = "아이디와 패스워드는 4~25자의 영문자와 숫자입니다.";
			return false;
		}
		return true;
	}
	
	$scope.submit = function(){
		if(!regexTest())
			return;
	    request('login', function (response) {
	    	if(response.success){
	    		$scope.logged = true;
	    		return;
	    	}
	    	$scope.errorMessage = response.errorMessage;
	    }, {user:JSON.stringify($scope.user)});
	}
	
	
	$scope.logout = function(){
	    request('logout', function (response) {
	    	if(response.success){
	    		$scope.logged = false;
	    		return;
	    	}
	    	$scope.errorMessage = response.errorMessage;
	    });
	}
	
	$scope.register = function(){
		if(!regexTest())
			return;
	    request('register', function (response) {
	    	if(response.success){
	    		$scope.logged = true;
	    		return;
	    	}
	    	$scope.errorMessage = response.errorMessage;
	    }, {user:JSON.stringify($scope.user)});
	}

	var request = function (type, response, data) {
	    clearTimeout(timer[type]);
	    timer[type] = setTimeout(function () {
	        $http(postRequest("/api" + url[type], data)).success(function (result) {
	            response(result);
	        });
	    }, 300);
	};
}]);

