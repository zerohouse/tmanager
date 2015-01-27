package tmanager.controllers;

import tmanager.object.database.User;
import easymapping.annotation.Controller;
import easymapping.annotation.Get;
import easymapping.mapping.Http;
import easymapping.response.Jsp;
import easymapping.response.Response;

@Controller
public class TmController {

	@Get("/tmanager/{}/{}/{}")
	public Response tmanagerDate(Http http) {
		Jsp jsp = new Jsp("tmanager.jsp");
		if (!forward(http, jsp))
			return null;
		return jsp;
	}

	@Get("/calendar/{}/{}/{}")
	public Response carendarViewDate(Http http) {
		Jsp jsp = new Jsp("calendar.jsp");
		if (!forward(http, jsp))
			return null;
		return jsp;
	}

	private boolean forward(Http http, Jsp jsp) {
		String pageAgent = http.getUriVariable(0);
		String dateStart = http.getUriVariable(1);
		String dateEnd = http.getUriVariable(2);
		jsp.put("pageAgent", pageAgent);
		jsp.put("dateStart", dateStart);
		jsp.put("dateEnd", dateEnd);
		String link = String.format("%s/%s/%s", pageAgent, dateStart, dateEnd);
		jsp.put("link", link);
		return true;
	}

	@Get("/calendar/{}")
	public Response carendarView(Http http) {
		Jsp jsp = new Jsp("calendar.jsp");
		String pageAgent = http.getUriVariable(0);
		if (pageAgent.length() > 3) {
			jsp.put("pageAgent", pageAgent);
			return jsp;
		}
		User user = http.getSessionAttribute(User.class, "user");
		if (user != null)
			pageAgent = user.getId();
		jsp.put("pageAgent", pageAgent);
		return jsp;
	}

	@Get("/tmanager/{}")
	public Response tmanager(Http http) {
		Jsp jsp = new Jsp("tmanager.jsp");
		String pageAgent = http.getUriVariable(0);
		if (pageAgent.length() > 3) {
			jsp.put("pageAgent", pageAgent);
			return jsp;
		}
		User user = http.getSessionAttribute(User.class, "user");
		if (user != null)
			pageAgent = user.getId();
		jsp.put("pageAgent", pageAgent);
		return jsp;
	}

}
