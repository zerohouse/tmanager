<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
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

        </div>
    </div>
</header>
<script>
	var agentId = '${pageAgent}';
	var dateStart = '${dateStart}';
	var dateEnd = '${dateEnd}';
</script>