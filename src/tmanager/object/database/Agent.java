package tmanager.object.database;

import java.util.Date;
import java.util.List;

import easyjdbc.annotation.Exclude;
import easyjdbc.annotation.Key;
import easyjdbc.annotation.Table;
import easyjdbc.query.QueryExecuter;

@Table("agent")
public class Agent {

	@Key
	private String id;
	private String ownerId;
	private String name;
	private Integer openType;
	
	@Exclude
	public final static Integer TYPE_PRIVATE = 0;
	@Exclude
	public final static Integer TYPE_VIEW_ONLY = 1;
	@Exclude
	public final static Integer TYPE_PUBLIC = 2;
	
	
	@Exclude
	private List<Schedule> schedules;
	@Exclude
	private List<Line> lines;
	
	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}


	public void getSchedulesAndLines(QueryExecuter qe, Date from, Date to, int level) {
		SchedulesAndLines ar = new SchedulesAndLines(qe, from, to, id, level);
		this.schedules = ar.getSchedules();
		this.lines = ar.getLines();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getOpenType() {
		return openType;
	}

	public void setOpenType(Integer openType) {
		this.openType = openType;
	}
	
	public boolean hasViewRight(QueryExecuter qe, String userId) {
		Agent agent = qe.get(Agent.class, id);
		this.openType = agent.getOpenType();
		if(openType == TYPE_PUBLIC)
			return true;
		if(openType == TYPE_VIEW_ONLY)
			return true;
		return ownerId.equals(userId);
	}


	public boolean hasUpdateRight(QueryExecuter qe, String userId) {
		Agent agent = qe.get(Agent.class, id);
		this.openType = agent.getOpenType();
		if(openType == TYPE_PUBLIC)
			return true;
		return ownerId.equals(userId);
	}

}
