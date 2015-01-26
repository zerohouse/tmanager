package tmanager.object.database;

import easyjdbc.annotation.Key;
import easyjdbc.annotation.Table;
import easyjdbc.query.QueryExecuter;

@Table("agent_relation")
public class AgentRelation {

	@Key
	private String parent;
	@Key
	private String child;
	

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getChild() {
		return child;
	}

	public void setChild(String child) {
		this.child = child;
	}

	public Agent getChildAgent(QueryExecuter qe) {
		return qe.get(Agent.class, child);
	}
	
	public Agent getParentAgent(QueryExecuter qe) {
		return qe.get(Agent.class, parent);
	}

}
