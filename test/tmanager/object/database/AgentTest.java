package tmanager.object.database;

import java.util.Date;

import org.junit.Test;

import easyjdbc.query.QueryExecuter;

public class AgentTest {

	@Test
	public void test() {
		QueryExecuter qe = new QueryExecuter();
		Date from = new Date();
		from.setTime(from.getTime() - 60*60*1000*24*10);
		Date to = new Date();
		SchedulesAndLines r = new SchedulesAndLines(qe, from, to, "worldcup", 10);
		System.out.println(r);
	}

}
