package tmanager.object.database;

import java.util.Date;

import easyjdbc.annotation.Key;
import easyjdbc.annotation.Table;
import easymapping.annotation.DateFormat;

@Table("schedule")
public class Schedule {

	@Key
	private Integer id;
	private Integer agentId;
	@DateFormat("yyyy-MM-dd hh:mm")
	private Date startTime;
	@DateFormat("yyyy-MM-dd hh:mm")
	private Date endTime;
	private String head;
	private String body;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getAgentId() {
		return agentId;
	}

	@Override
	public String toString() {
		return "Schedule [id=" + id + ", agentId=" + agentId + ", startTime=" + startTime + ", endTime=" + endTime + ", head=" + head + ", body="
				+ body + "]";
	}

	public void setAgentId(Integer agentId) {
		this.agentId = agentId;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getHead() {
		return head;
	}

	public void setHead(String head) {
		this.head = head;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

}
