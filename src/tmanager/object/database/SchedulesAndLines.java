package tmanager.object.database;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import easyjdbc.query.QueryExecuter;

public class SchedulesAndLines {
	
	private QueryExecuter qe;
	private Date from;
	private Date to;
	private int level;
	private int levelCount =0;
	
	
	private List<Schedule> schedules;
	private List<Line> lines;
	
	private List<String> used = new ArrayList<String>();

	public SchedulesAndLines(QueryExecuter qe, Date from, Date to, String id, int level) {
		schedules = qe.getList(Schedule.class, "agentId=? and startTime between ? and ? and endTime between ? and ?", id, from, to, from, to);
		lines = qe.getList(Line.class, "agentId=? and time between ? and ?", id, from, to);
		this.qe = qe;
		this.from = from;
		this.to = to;
		this.level = level;
		doRun(id);
	}

	@Override
	public String toString() {
		return "AgentRecursion [schedules=" + schedules + ", lines=" + lines + "]";
	}

	private void doRun(String id){
		if(used.contains(id))
			return;
		used.add(id);
		if (levelCount >= level)
			return;
		levelCount++;
		List<AgentRelation> list = qe.getList(AgentRelation.class, "parent=?", id);
		list.forEach(each -> {
			List<Schedule> eachSchedules = qe.getList(Schedule.class, "agentId=? and startTime between ? and ? and endTime between ? and ?",
					each.getChild(), from, to, from, to); // 하나하나 찾음 스케줄들을
			List<Line> eachLines = qe.getList(Line.class, "agentId=? and time between ? and ?", each.getChild(), from, to);
			schedules.addAll(eachSchedules); // 스케줄스에 찾은거 모두 넣음
			lines.addAll(eachLines); // 스케줄스에 찾은거 모두 넣음
			doRun(each.getChild());
		});
	}
	
	public List<Schedule> getSchedules() {
		return schedules;
	}

	public List<Line> getLines() {
		return lines;
	}

}