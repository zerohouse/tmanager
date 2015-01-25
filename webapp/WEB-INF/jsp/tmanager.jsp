<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
<head lang="en">
	<%@ include file="/WEB-INF/fragment/cssImports.jsp"%>
    <link href="/css/timeline.css" rel="stylesheet" media="screen">
    <title>T 매니저 - Timeline</title>
</head>
<body ng-app="onemanager">
<header class="navbar navbar-default navbar-fixed-top bs-docs-nav" role="banner">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">T Manager</a>
        </div>
        <div class="navbar-collapse collapse">

            <ul class="nav navbar-nav">
                <li><a href="#">Timeline</a></li>
            </ul>

        </div>
    </div>
</header>
<br><br><br><br>

<div class="container" ng-controller="timetable">
    <div class="row">
        <div class="col-md-4">
            <div class="dropdown">
                <h4 class="dropdown-toggle pointer">
                    {{(start|date:"yyyy년 M월 d일 ~")||"기간을 "}} {{(end|date:"yyyy년 M월 d일")||"선택해 주세요!"}} <span class="caret" ng-show="!timeQuantums"></span>
                </h4>

                <div class="dropdown-menu" ng-click="$event.preventDefault();$event.stopPropagation()">
                    <div date-range start="start" end="end"></div>
                </div>
            </div>
        </div>
        <div class="col-md-offset-4 col-md-4">

            <div class="pull-right">
                <span class="dropdown">
                    <span class="btn btn-primary dropdown-toggle" type="button"
                            data-toggle="dropdown" aria-expanded="true">
                        새 스케줄러
                        <span class="caret"></span>
                    </span>
                    <ul class="dropdown-menu">
                        <li><a ng-click="newAgent()">추가하기 +</a></li>
                        <li>
                            <div class="input-group input-padding" ng-click="stop($event)"><input class="form-control"
                                                                                                  placeholder="ID, 이름으로 검색">
                            </div>
                        </li>
                    </ul>
                </span>
                <span ng-click="expand()" class="btn btn-success fa fa-plus-square big-icon"></span>
                <span ng-click="reduce()" class="btn btn-success fa fa-minus-square big-icon"></span>
            </div>
        </div>
    </div>

    <div class="row">
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

    <!--Modal Show-->
    <div class="modal fade" id="schedule" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        <div><span ng-click="toggleModify(selectedHead);stop($event)"
                                   ng-show="!selectedHead.modify">{{selectedSchedule.head||"제목"}}</span>
                            <input ng-click="stop($event)" ng-enter="toggleModify(selectedHead);updateSchedule(selectedSchedule)"
                                   ng-show="selectedHead.modify"
                                   class="form-control" ng-model="selectedSchedule.newhead" ng-init="selectedSchedule.newhead = selectedSchedule.head">
                        </div>
                    </h4>
                </div>
                <div class="modal-body">
                    <div><span ng-click="toggleModify(selectedBody);stop($event)"
                               ng-show="!selectedBody.modify">{{selectedSchedule.body||"내용"}}</span>

                        <div ng-show="selectedBody.modify">
                        <textarea ng-click="stop($event)"
                                  class="form-control"
                                  ng-model="selectedSchedule.newbody" ng-init="selectedSchedule.newbody = selectedSchedule.body">{{selectedSchedule.newbody||"내용"}}</textarea>
                        <div class="btn btn-success" ng-click="updateSchedule(selectedSchedule)">수정하기</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <ul class="list-group" ng-show="show.Reply">
                        <li ng-repeat="reply in selectedSchedule.replies" class="list-group-item">{{reply.body}}</li>
                        <li class="list-group-item"><input ng-enter="submitReply();"
                                                           class="form-control" ng-model="newReply.body"></li>
                    </ul>

                    <button type="button" class="btn btn-default"
                            ng-click="toggle('Reply');stop($event)">리플<span
                            ng-show="!show.Reply">보기</span> <span
                            ng-show="show.Reply">접기</span> <span class="badge">{{selectedSchedule.replies.length}}</span>
                    </button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="deleteSelected()">삭제
                        <button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<%@ include file="/WEB-INF/fragment/jsimports.jsp"%>
<script src="/js/timeline.js"></script>
</body>
</html>