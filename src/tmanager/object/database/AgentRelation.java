package tmanager.object.database;

import easyjdbc.annotation.Key;
import easyjdbc.annotation.Table;
import easyjdbc.query.QueryExecuter;

@Table("agent_relation")
public class AgentRelation {

	@Key
	private Integer parent;
	@Key
	private Integer child;

	public Integer getParent() {
		return parent;
	}

	public void setParent(Integer parent) {
		this.parent = parent;
	}

	public Integer getChild() {
		return child;
	}

	public void setChild(Integer child) {
		this.child = child;
	}

	public Agent getChildAgent(QueryExecuter qe) {
		return qe.get(Agent.class, child);
	}
	
	public Agent getParentAgent(QueryExecuter qe) {
		return qe.get(Agent.class, parent);
	}
}
