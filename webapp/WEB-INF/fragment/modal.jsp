<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
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
                            <input ng-click="stop($event)" ng-enter="toggleModify(selectedHead);update(selectedSchedule)"
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
                        <div class="btn btn-success" ng-click="update(selectedSchedule)">수정하기</div>
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