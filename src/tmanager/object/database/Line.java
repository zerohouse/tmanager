package tmanager.object.database;

import java.util.Date;

import easyjdbc.annotation.Key;
import easyjdbc.annotation.Table;
import easymapping.annotation.DateFormat;

@Table("line")
public class Line {
	
	@Key
	private Integer id;
	private String agentId;
	@DateFormat("yyyy-MM-dd hh:mm")
	private Date time;
	private String head;
	private String body;

	public Integer getId() {
		return id;
	}

	@Override
	public String toString() {
		return "Line [id=" + id + ", agentId=" + agentId + ", time=" + time + ", head=" + head + ", body=" + body + "]";
	}

	public void setId(Integer id) {
		this.id = id;
	}


	public String getAgentId() {
		return agentId;
	}

	public void setAgentId(String agentId) {
		this.agentId = agentId;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
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
