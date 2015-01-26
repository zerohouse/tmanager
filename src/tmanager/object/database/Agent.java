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
		List<AgentRelation> list = qe.getList(AgentRelation.class, "parent=?", id);
		list.forEach(each -> {
			List<Schedule> eachSchedules = qe.getList(Schedule.class, "agentId=? and startTime between ? and ? and endTime between ? and ?", each.getChild(), from, to, from, to);
			List<Line> eachLines = qe.getList(Line.class, "agentId=? and time between ? and ?", each.getChild(), from, to);
			schedules.addAll(eachSchedules);
			lines.addAll(eachLines);
		});
		
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
