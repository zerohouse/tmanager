package tmanager.controllers;

import easymapping.annotation.Controller;
import easymapping.annotation.Get;
import easymapping.mapping.Http;
import easymapping.response.Jsp;
import easymapping.response.Response;

@Controller
public class TmController {
	
	@Get("/tm/{}")
	public Response tmanager(Http http){
		Jsp jsp = new Jsp("tmanager.jsp");
		return jsp;
	}
}
