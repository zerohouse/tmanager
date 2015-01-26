package tmanager.object.database;

import java.util.Date;

import easyjdbc.annotation.Key;
import easyjdbc.annotation.Table;

@Table("reply")
public class Reply {
	@Key
	private Integer id;
	private Integer rid;
	private Integer agentId;
	private Date writeTime;
	private String reply;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getRid() {
		return rid;
	}

	public void setRid(Integer rid) {
		this.rid = rid;
	}

	public Integer getAgentId() {
		return agentId;
	}

	public void setAgentId(Integer agentId) {
		this.agentId = agentId;
	}

	public Date getWriteTime() {
		return writeTime;
	}

	public void setWriteTime(Date writeTime) {
		this.writeTime = writeTime;
	}

	public String getReply() {
		return reply;
	}

	public void setReply(String reply) {
		this.reply = reply;
	}

}
