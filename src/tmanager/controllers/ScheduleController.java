package tmanager.controllers;


import tmanager.object.database.Schedule;
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
		schedule.setId(qe.insertAndGetPrimaryKey(schedule).intValue());
		qe.close();
		return new Json(schedule);
	}
	
	@Post("/api/schedule/update")
	public Response update(Http http) {
		Schedule schedule = http.getJsonObject(Schedule.class, "schedule");
		QueryExecuter qe = new QueryExecuter();
		int result = qe.update(schedule);
		qe.close();
		if (result == 0)
			return new Json(new Result(false, "DB 입력중 오류가 발생했습니다."));
		return new Json(new Result(true, null));
	}
}
