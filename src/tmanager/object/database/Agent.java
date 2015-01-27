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
	private String name;
	private Integer openType;
	
	@Exclude
	public final static Integer TYPE_PRIVATE = 0;
	@Exclude
	public final static Integer TYPE_PUBIC = 1;
	@Exclude
	public final static Integer TYPE_PUBLIC_ALL = 2;
	
	
	@Exclude
	private List<Schedule> schedules;
	@Exclude
	private List<Line> lines;

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

}
