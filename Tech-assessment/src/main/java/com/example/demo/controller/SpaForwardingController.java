package com.example.demo.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardingController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        // Forward all 404 errors (or any unhandled error) to the SPA's index.html
        return "forward:/index.html";
    }
}
