package tmanager.controllers;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import tmanager.object.database.Agent;
import tmanager.object.database.AgentRelation;
import tmanager.object.support.Result;
import easyjdbc.query.QueryExecuter;
import easyjdbc.query.raw.ExecuteQuery;
import easyjdbc.query.raw.GetRecordQuery;
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
		QueryExecuter qe = new QueryExecuter();
		ExecuteQuery query = new ExecuteQuery("insert into agent values ()");
		GetRecordQuery primary = new GetRecordQuery(1, "SELECT LAST_INSERT_ID();");
		qe.execute(query);
		BigInteger child = (BigInteger) qe.execute(primary).get(0);
		agent.setId(child.intValue());
		AgentRelation agentRelation = new AgentRelation();
		int parentId = Integer.parseInt(http.getParameter("agentId"));
		agentRelation.setParent(parentId);
		agentRelation.setChild(child.intValue());
		qe.insert(agentRelation);
		qe.close();
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
		int agentId = Integer.parseInt(http.getParameter("agentId"));
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
}
