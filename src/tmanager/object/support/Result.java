package tmanager.object.support;

public class Result {
	boolean success;
	String errorMessage;

	public Result(boolean success, String errorMessage) {
		this.success = success;
		this.errorMessage = errorMessage;
	}
}
