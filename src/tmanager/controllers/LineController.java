package tmanager.controllers;

import tmanager.object.database.Agent;
import tmanager.object.database.Line;
import tmanager.object.database.User;
import tmanager.object.support.Result;
import easyjdbc.query.QueryExecuter;
import easymapping.annotation.Controller;
import easymapping.annotation.Post;
import easymapping.mapping.Http;
import easymapping.response.Json;
import easymapping.response.Response;

@Controller
public class LineController {

	@Post("/api/line/new")
	public Response newLine(Http http) {
		Line line = http.getJsonObject(Line.class, "line");
		QueryExecuter qe = new QueryExecuter();
		User user = http.getSessionAttribute(User.class, "user");
		if (user == null)
			return new Json(new Result(false, "권한이 없습니다."));
		Agent agent = qe.get(Agent.class, line.getAgentId());
		if(!agent.hasUpdateRight(qe, user.getId()))
			return new Json(new Result(false, "권한이 없습니다."));
		line.setId(qe.insertAndGetPrimaryKey(line).intValue());
		qe.close();
		return new Json(line);
	}

	@Post("/api/line/update")
	public Response update(Http http) {
		Line line = http.getJsonObject(Line.class, "line");
		QueryExecuter qe = new QueryExecuter();
		User user = http.getSessionAttribute(User.class, "user");
		if (user == null)
			return new Json(new Result(false, "권한이 없습니다."));
		Agent agent = qe.get(Agent.class, line.getAgentId());
		if(!agent.hasUpdateRight(qe, user.getId()))
			return new Json(new Result(false, "권한이 없습니다."));
		int result = qe.update(line);
		qe.close();
		if (result == 0)
			return new Json(new Result(false, "DB 입력중 오류가 발생했습니다."));
		return new Json(new Result(true, null));
	}

	@Post("/api/line/delete")
	public Response delete(Http http) {
		QueryExecuter qe = new QueryExecuter();
		Line line = qe.get(Line.class, Integer.parseInt(http.getParameter("lineId")));
		User user = http.getSessionAttribute(User.class, "user");
		if (user == null)
			return new Json(new Result(false, "권한이 없습니다."));
		Agent agent = qe.get(Agent.class, line.getAgentId());
		if(!agent.hasUpdateRight(qe, user.getId()))
			return new Json(new Result(false, "권한이 없습니다."));
		int result = qe.delete(line);
		qe.close();
		if (result == 0)
			return new Json(new Result(false, "DB 입력중 오류가 발생했습니다."));
		return new Json(new Result(true, null));
	}
}
