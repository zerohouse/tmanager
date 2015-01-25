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
	private Integer id;
	private String name;

	@Exclude
	private List<Schedule> schedules;
	@Exclude
	private List<Line> lines;

	public void getSchedulesAndLines(QueryExecuter qe, Date from, Date to) {
		schedules = qe.getList(Schedule.class, "agentId=? and startTime between ? and ? and endTime between ? and ?", id, from, to, from, to);
		lines = qe.getList(Line.class, "agentId=? and time between ? and ?", id, from, to);
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
