package tmanager.object.database;

import java.util.Date;

import org.junit.Test;

import easyjdbc.query.QueryExecuter;

public class AgentTest {

	@Test
	public void test() {
		QueryExecuter qe = new QueryExecuter();
		Date from = new Date();
		from.setTime(from.getTime() - 60*60*1000*24*30000);
		Date to = new Date();
		Agent agent = qe.get(Agent.class, "play");
		agent.getSchedulesAndLines(qe, from, to, 0);
		System.out.println(agent);
		System.out.println(from);
		System.out.println(to);
		System.out.println(qe.getList(Line.class, "agentId=? and time between ? and ?", "jobbank", from, to));
		System.out.println(qe.getList(Schedule.class, "agentId=? and startTime between ? and ? and endTime between ? and ?", "lol", from, to, from, to));
	}
	
	

}
