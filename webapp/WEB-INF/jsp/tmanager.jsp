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
        <div ng-show="timeQuantums.length>0" class="col-md-offset-4 col-md-4">

            <div class="pull-right">
                <span class="dropdown">
                	<span ng-show="updateing" class="glyphicon glyphicon-refresh big-icon rotating"></span>
                    <span class="dropdown-toggle big-icon hover" type="button"
                            data-toggle="dropdown" aria-expanded="true">
                        새 스케줄러
                        <span class="caret"></span>
                    </span>
                    <ul class="dropdown-menu search-box">
                       <li class="input-group input-padding" ng-click="stop($event)">
                         	<input class="form-control" ng-change="search()" ng-model="keyword" placeholder="ID, 이름으로 검색">
                       </li>
                        <li ng-repeat="result in searchResults" class="list-group-item no-padding"><a ng-click="addById(result[0])">{{result[1]||"무제"}}(schedule ID: {{result[0]}}) 추가하기</a></li>
                        <li ng-show="searchResults.length==0&&keyword!=''" class="list-group-item disabled">검색결과가 없습니다.</li>
                        <li ng-show="newAgentPossible()" class="list-group-item no-padding"><a ng-click="newAgent()">이 아이디로 새로만들기</a></li>
                    </ul>
                </span>
                <span ng-click="expand()" class="glyphicon glyphicon-plus big-icon hover"></span>
                <span ng-click="reduce()" class="glyphicon glyphicon-minus big-icon hover"></span>
               
            </div>
        </div>
    </div>

    <div class="row"  ng-show="timeQuantums.length>0">
        <div class="col-md-12">
            <!-- 테이블 -->
            <table id="table" class="table none-select cursor" ng-mousedown="mousedown($event)">
                <thead>
                <tr>
                    <th class="left-header"></th>
                    <th ng-repeat="agent in agents">
                        <div>
                            <div ng-show="!agent.modify">
                                <span class="dropdown">
                                    <div class="dropdown-toggle"
                                         type="button" data-toggle="dropdown" aria-expanded="true">
                                        <span ng-click="toggleModify(agent);stop($event)">{{agent.name||"무제"}}</span>
                                        <span class="caret"></span>
                                    </div>
                                    <ul class="dropdown-menu">
                                        <li role="presentation" class="dropdown-header">ID : {{agent.id}}</li>
                                        <li ng-click="newSchedule(agent)"><a>스케줄 추가하기+</a></li>
                                        <li ng-click="newLine(agent)"><a>데드라인 추가하기+</a></li>
                                        <li ng-click="deleteAgent(agent)"><a>스케줄러 삭제</a></li>
                                    </ul>
                                </span>
                            </div>
                            <div ng-show="agent.modify">
                                <input ng-click="stop($event)" ng-enter="toggleModify(agent);updateAgent(agent)"
                                       class="form-control"
                                       ng-model="agent.newname" ng-init="agent.newname = agent.name">
                            </div>
                        </div>


                        <div ng-repeat="schedule in agent.schedules"
                             ng-click="showSchedule(schedule)"
                             ng-style="style.schedule(schedule)" class="schedule">

                            <div><span ng-click="toggleModify(schedule);stop($event)" ng-show="!schedule.modify">
                                <h4>{{schedule.head||"제목"}}</h4></span>
                                <input ng-enter="toggleModify(schedule);updateSchedule(schedule)" ng-click="stop($event)"
                                       ng-show="schedule.modify"
                                       class="form-control" ng-model="schedule.newhead" ng-init="schedule.newhead = schedule.head">
                            </div>

                            <span class="schedule-time">{{schedule.startTime|date:"M월 d일 HH:mm"}}부터<br>
                                {{schedule.endTime|date:"M월 d일 HH:mm"}}까지</span>
                        </div>
                        <div ng-repeat="line in agent.lines"
                             ng-click="showSchedule(line)"
                             ng-style="style.line(line)" class="line">

                            <div><span ng-click="toggleModify(line);stop($event)" ng-show="!line.modify">
                                <h4>{{line.head||"제목"}}</h4></span>
                                <input ng-enter="toggleModify(line);updateLine(line)" ng-click="stop($event)"
                                       ng-show="line.modify"
                                       class="form-control" ng-model="line.newhead" ng-init="line.newhead = line.head">
                            </div>

                            <span class="schedule-time">{{line.time|date:"M월 d일 HH:mm"}}</span>

                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr ng-repeat="quantum in timeQuantums">
                    <th class="left-header">{{durationName()}}{{timeQuantums.indexOf(quantum)+1}}
                        <div class="schedule-time">({{quantum|date:"M월 d일 HH:mm"}})</div>
                    </th>
                    <td ng-style="style.td()" ng-repeat="agent in agents"></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
	<%@ include file="/WEB-INF/fragment/modal.jsp"%>
</div>

<%@ include file="/WEB-INF/fragment/jsimports.jsp"%>
<script src="/js/timeline.js"></script>
</body>
</html>