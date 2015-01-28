package tmanager.controllers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import tmanager.object.database.Agent;
import tmanager.object.database.AgentRelation;
import tmanager.object.database.User;
import tmanager.object.support.Result;
import easyjdbc.query.QueryExecuter;
import easyjdbc.query.raw.GetRecordsQuery;
import easymapping.annotation.Controller;
import easymapping.annotation.Post;
import easymapping.mapping.Http;
import easymapping.response.Json;
import easymapping.response.Response;

@Controller
public class AgentController {

	@Post("/api/agents/new")
	public Response newAgent(Http http) {
		User user = http.getSessionAttribute(User.class, "user");
		if(user==null)
			return new Json(new Result(false, "로그인 해 주세요."));
		String childId = http.getParameter("childId");
		String parentId = http.getParameter("agentId");
		if (childId.equals(parentId))
			return new Json(new Result(false, "하위 스케줄러에 자신을 추가할 수 없습니다."));
		Agent agent = new Agent();
		agent.setId(childId);
		agent.setOwnerId(user.getId());
		QueryExecuter qe = new QueryExecuter();
		int result = qe.insert(agent);
		AgentRelation agentRelation = new AgentRelation();

		agentRelation.setParent(parentId);
		agentRelation.setChild(childId);
		result += qe.insert(agentRelation);
		qe.close();
		if (result != 2)
			return new Json(new Result(false, "DB 입력중 오류가 발생했습니다."));
		return new Json(agent);
	}

	@Post("/api/agents/update")
	public Response update(Http http) {
		Agent passed = http.getJsonObject(Agent.class, "agent");
		QueryExecuter qe = new QueryExecuter();
		Agent agent = qe.get(Agent.class, passed.getId());
		if (!agent.hasUpdateRight(qe, http.getSessionAttribute(User.class,"user").getId()))
			return new Json(new Result(false, "수정권한이 없습니다."));
		int result = qe.update(passed);
		qe.close();
		if (result == 0)
			return new Json(new Result(false, "DB 입력중 오류가 발생했습니다."));
		return new Json(new Result(true, null));
	}

	@Post("/api/agents/delete")
	public Response delete(Http http) {
		QueryExecuter qe = new QueryExecuter();
		AgentRelation agentRelation = http.getJsonObject(AgentRelation.class, "agentRelation");
		if(agentRelation.parentEqualsChild())
			return new Json(new Result(false, "자기자신을 지울 수 없습니다."));
		int result = qe.delete(agentRelation);
		qe.close();
		if (result == 0)
			return new Json(new Result(false, "DB 입력중 오류가 발생했습니다."));
		return new Json(new Result(true, null));
	}

	@Post("/api/agents/refresh")
	public Response refresh(Http http) {
		Date start = new Date();
		start.setTime(Long.parseLong(http.getParameter("start")));
		Date end = new Date();
		end.setTime(Long.parseLong(http.getParameter("end")));
		String agentId = http.getParameter("agentId");
		QueryExecuter qe = new QueryExecuter();
		List<AgentRelation> list = qe.getList(AgentRelation.class, "parent=?", agentId);
		List<Agent> agentList = new ArrayList<Agent>();
		Agent parent = qe.get(Agent.class, agentId);
		if (parent != null) {
			parent.getSchedulesAndLines(qe, start, end, 0);
			agentList.add(parent);
		}
		list.forEach(each -> {
			Agent agent = each.getChildAgent(qe);
			if (agent != null) {
				agent.getSchedulesAndLines(qe, start, end, 4);
				agentList.add(agent);
			}
		});
		qe.close();
		return new Json(agentList);
	}

	@Post("/api/agents/addById")
	public Response addById(Http http) {
		Date start = new Date();
		start.setTime(Long.parseLong(http.getParameter("start")));
		Date end = new Date();
		end.setTime(Long.parseLong(http.getParameter("end")));
		String parentId = http.getParameter("parentId");
		String agentId = http.getParameter("agentId");
		if (parentId.equals(agentId))
			return new Json(new Result(false, "하위 스케줄러에 자신을 추가할 수 없습니다."));
		QueryExecuter qe = new QueryExecuter();
		Agent agent = qe.get(Agent.class, agentId);
		agent.getSchedulesAndLines(qe, start, end, 4); // 레벨은 리커션 딥서치레벨
		AgentRelation relation = new AgentRelation();
		relation.setParent(parentId);
		relation.setChild(agentId);
		qe.insert(relation);
		qe.close();
		return new Json(agent);
	}

	@Post("/api/agents/search")
	public Response search(Http http) {
		String keyword = http.getParameter("keyword");
		GetRecordsQuery query = new GetRecordsQuery(2, "select id, name from agent where openType!=0 and (name like '%" + keyword + "%' or id like'%" + keyword + "%')");
		QueryExecuter qe = new QueryExecuter();
		List<List<Object>> result = qe.execute(query);
		qe.close();
		return new Json(result);
	}
}
