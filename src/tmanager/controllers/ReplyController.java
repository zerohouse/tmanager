package tmanager.controllers;

import easymapping.annotation.Controller;
import easymapping.annotation.Post;
import easymapping.mapping.Http;
import easymapping.response.Response;

@Controller
public class ReplyController {

	@Post("/api/reply/write")
	public Response write(Http http){
		return null;
	}
	
	@Post("/api/reply/getList")
	public Response getlist(Http http){
		return null;
	}
	
	@Post("/api/reply/update")
	public Response update(Http http){
		return null;
	}
	
	@Post("/api/reply/delete")
	public Response delete(Http http){
		return null;
	}
	
}
