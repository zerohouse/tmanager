package tmanager.controllers;

import tmanager.object.database.User;
import tmanager.object.support.Result;
import easyjdbc.query.QueryExecuter;
import easymapping.annotation.Controller;
import easymapping.annotation.Post;
import easymapping.mapping.Http;
import easymapping.response.Json;
import easymapping.response.Response;

@Controller
public class UserController {

	@Post("/api/users/login")
	public Response login(Http http) {
		User user = http.getJsonObject(User.class, "user");
		QueryExecuter qe = new QueryExecuter();
		Boolean rightUser = user.matchPassword(qe);
		qe.close();
		if (rightUser == null)
			return new Json(new Result(false, "없는 아이디입니다."));
		if (!rightUser)
			return new Json(new Result(false, "패스워드가 다릅니다."));
		http.setSessionAttribute("user", user);
		return new Json(new Result(true, user.getId()));
	}

	@Post("/api/users/register")
	public Response register(Http http) {
		User user = http.getJsonObject(User.class, "user");
		QueryExecuter qe = new QueryExecuter();
		if (qe.get(User.class, user.getId()) != null) {
			qe.close();
			return new Json(new Result(false, "이미 있는 아이디입니다."));
		}
		if (qe.insert(user) == 0) {
			qe.close();
			return new Json(new Result(false, "DB입력 중 오류가 발생하였습니다."));
		}
		http.setSessionAttribute("user", user);
		qe.close();
		return new Json(new Result(true, null));
	}

	@Post("/api/users/logout")
	public Response logout(Http http) {
		http.removeSessionAttribute("user");
		return new Json(new Result(true, null));
	}
}
