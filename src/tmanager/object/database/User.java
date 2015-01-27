package tmanager.object.database;

import easyjdbc.annotation.Key;
import easyjdbc.annotation.Table;
import easyjdbc.query.QueryExecuter;

@Table("user")
public class User {
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Key
	private String id;
	private String password;

	public Boolean matchPassword(QueryExecuter qe) {
		User user = qe.get(User.class, id);
		if (user == null)
			return null;
		return user.getPassword().equals(password);
	}
}
