package tmanager.controllers;

import tmanager.object.database.Agent;
import tmanager.object.database.Schedule;
import tmanager.object.database.User;
import tmanager.object.support.Result;
import easyjdbc.query.QueryExecuter;
import easymapping.annotation.Controller;
import easymapping.annotation.Post;
import easymapping.mapping.Http;
import easymapping.response.Json;
import easymapping.response.Response;

@Controller
public class ScheduleController {

	@Post("/api/schedule/new")
	public Response newSchedule(Http http) {
		Schedule schedule = http.getJsonObject(Schedule.class, "schedule");
		QueryExecuter qe = new QueryExecuter();
		User user = http.getSessionAttribute(User.class, "user");
		if (user == null)
			return new Json(new Result(false, "권한이 없습니다."));
		Agent agent = qe.get(Agent.class, schedule.getAgentId());
		if (!agent.hasUpdateRight(qe, user.getId()))
			return new Json(new Result(false, "권한이 없습니다."));
		schedule.setId(qe.insertAndGetPrimaryKey(schedule).intValue());
		qe.close();
		return new Json(schedule);
	}

	@Post("/api/schedule/update")
	public Response update(Http http) {
		Schedule schedule = http.getJsonObject(Schedule.class, "schedule");
		QueryExecuter qe = new QueryExecuter();
		User user = http.getSessionAttribute(User.class, "user");
		Agent agent = qe.get(Agent.class, schedule.getAgentId());
		if (user == null)
			return new Json(new Result(false, "권한이 없습니다."));
		if (!agent.hasUpdateRight(qe, user.getId()))
			return new Json(new Result(false, "권한이 없습니다."));
		int result = qe.update(schedule);
		qe.close();
		if (result == 0)
			return new Json(new Result(false, "DB 입력중 오류가 발생했습니다."));
		return new Json(new Result(true, null));
	}

	@Post("/api/schedule/delete")
	public Response delete(Http http) {
		QueryExecuter qe = new QueryExecuter();
		Schedule schedule = qe.get(Schedule.class, http.getParameter("scheduleId"));
		User user = http.getSessionAttribute(User.class, "user");
		if (user == null)
			return new Json(new Result(false, "권한이 없습니다."));
		Agent agent = qe.get(Agent.class, schedule.getAgentId());
		if (!agent.hasUpdateRight(qe, user.getId()))
			return new Json(new Result(false, "권한이 없습니다."));
		int result = qe.delete(schedule);
		qe.close();
		if (result == 0)
			return new Json(new Result(false, "DB 입력중 오류가 발생했습니다."));
		return new Json(new Result(true, null));
	}
}
