<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
<head lang="en">
	<%@ include file="/WEB-INF/fragment/cssImports.jsp"%>
    <link href="/css/timeline.css" rel="stylesheet" media="screen">
    <title>T 매니저 - Timeline</title>
</head>
<body ng-app="tmanager">
<%@ include file="/WEB-INF/fragment/header.jsp"%>
<br><br><br><br>

<div class="container" ng-controller="timetable">
    <div class="row">
        <div class="col-md-4">
            <div class="dropdown">
                <h4 class="dropdown-toggle pointer hover">
                    {{(start|date:"yyyy년 M월 d일 ~")||"기간을 "}} {{(end|date:"yyyy년 M월 d일")||"선택해 주세요!"}} <span class="caret" ng-show="!timeQuantums"></span>
                </h4>

                <div class="dropdown-menu" ng-click="$event.preventDefault();$event.stopPropagation()">
                    <div date-range start="start" end="end"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="row" ng-show="weeks.length>0">
        <div class="col-md-12">
            <!-- 테이블 -->
            <table id="table" class="table none-select cursor" ng-mousedown="mousedown($event)">
                <thead>
                <tr>
                    <th class="left-header"></th>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thur</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
                </thead>
                <tbody>
                <tr ng-repeat="week in weeks">
                    <th class="left-header">Week {{weeks.indexOf(week)+1}}</th>
                    <td ng-repeat="day in week">{{day.date|date:"M-d"}}
                    <div ng-repeat="schedule in day.schedules" ng-click="showSchedule(schedule)">{{schedule.head||"S"}} {{schedule.startTime|date:"M-d HH:mm"}}~{{schedule.endTime|date:"M-d HH:mm"}}</div>
                    <div ng-repeat="line in day.lines" ng-click="showSchedule(line)">{{line.head||"L"}} {{line.time|date:"M-d HH:mm"}}까지</div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
	<%@ include file="/WEB-INF/fragment/modal.jsp"%>
</div>

<%@ include file="/WEB-INF/fragment/jsimports.jsp"%>
<script src="/js/calendar.js"></script>
</body>
</html>