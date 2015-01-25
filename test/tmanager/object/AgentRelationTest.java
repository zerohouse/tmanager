package tmanager.object;

import java.util.List;

import org.junit.Test;

import tmanager.object.database.AgentRelation;
import easyjdbc.query.QueryExecuter;

public class AgentRelationTest {

	@Test
	public void test() {
		QueryExecuter qe = new QueryExecuter();
		List<AgentRelation> list = qe.getList(AgentRelation.class, "parent=?", "1");
		qe.close();
		System.out.println(list);
	}
	
	@Test
	public void getCon(){
		QueryExecuter.getConnection();
	}

}
