<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<header class="navbar navbar-default navbar-fixed-top bs-docs-nav" role="banner" ng-controller="headerController">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">T Manager</a>
        </div>
        <div class="navbar-collapse collapse">

            <ul class="nav navbar-nav">
                <li><a href ng-click="link('tmanager')">Timeline</a></li>
                <li><a href ng-click="link('calendar')">Calendar</a></li>
            </ul>

			<form ng-controller='loginController' ng-submit="submit()" class="navbar-form navbar-right">
				<div ng-show="logged">
					<a class="btn btn-primary" ng-click="logout()">로그아웃</a>
				</div>
				<div ng-show="!logged">
					<div class='alert alert-danger' ng-show="errorMessage">{{errorMessage}}</div>
					<div class="form-group">
						<input type="text" placeholder="ID" ng-model='user.id'	class="form-control">
					</div>
					<div class="form-group">
						<input type="password" placeholder="Password" ng-model='user.password' class="form-control">
					</div>
					<button type='submit' class="btn btn-primary">로그인</button>
					<a class="btn btn-info" ng-click="register()">회원 가입</a>
				</div>
			</form>

        </div>
    </div>
</header>
<script>
	var agentId = '${pageAgent}';
	var dateStart = '${dateStart}';
	var dateEnd = '${dateEnd}';
	var logged = false;
</script>
<c:if test="${not empty sessionScope.user}">
	<script>
		logged = true;
	</script>
</c:if>