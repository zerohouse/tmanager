package tmanager.controllers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import tmanager.object.database.Agent;
import tmanager.object.database.AgentRelation;
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
		Agent agent = new Agent();
		String childId = http.getParameter("childId");
		agent.setId(childId);
		QueryExecuter qe = new QueryExecuter();
		int result = qe.insert(agent);
		AgentRelation agentRelation = new AgentRelation();
		String parentId = http.getParameter("agentId");
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
		Agent agent = http.getJsonObject(Agent.class, "agent");
		QueryExecuter qe = new QueryExecuter();
		int result = qe.update(agent);
		qe.close();
		if (result == 0)
			return new Json(new Result(false, "DB 입력중 오류가 발생했습니다."));
		return new Json(new Result(true, null));
	}

	@Post("/api/agents/delete")
	public Response delete(Http http) {
		AgentRelation agentRelation = http.getJsonObject(AgentRelation.class, "agentRelation");
		QueryExecuter qe = new QueryExecuter();
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
		for (int i = 0; i < list.size(); i++) {
			Agent agent = list.get(i).getChildAgent(qe);
			if (agent == null)
				continue;
			agent.getSchedulesAndLines(qe, start, end);
			agentList.add(agent);
		}
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
		QueryExecuter qe = new QueryExecuter();
		Agent agent = qe.get(Agent.class, agentId);
		agent.getSchedulesAndLines(qe, start, end);
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
		GetRecordsQuery query = new GetRecordsQuery(2, "select * from agent where name like '%" + keyword + "%' or id like'%" + keyword + "%'");
		QueryExecuter qe = new QueryExecuter();
		List<List<Object>> result = qe.execute(query);
		qe.close();
		return new Json(result);
	}
}
